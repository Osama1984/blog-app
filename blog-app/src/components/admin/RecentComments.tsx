import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatRelativeTime } from '@/lib/utils'

async function getRecentComments() {
  try {
    const comments = await prisma.comment.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        },
        post: {
          select: {
            title: true,
            slug: true
          }
        }
      }
    })
    return comments
  } catch (error) {
    console.error('Error fetching recent comments:', error)
    return []
  }
}

export async function RecentComments() {
  const comments = await getRecentComments()

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Recent Comments
          </h3>
          <Link
            href="/admin/comments"
            className="text-sm font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
          >
            View all
          </Link>
        </div>
        
        <div className="flow-root">
          <ul className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
            {comments.length === 0 ? (
              <li className="py-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">No comments found</p>
              </li>
            ) : (
              comments.map((comment) => (
                <li key={comment.id} className="py-4">
                  <div className="flex space-x-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {comment.author.name || comment.author.email}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatRelativeTime(comment.createdAt)}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {comment.content}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        on &ldquo;{comment.post.title}&rdquo;
                      </p>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

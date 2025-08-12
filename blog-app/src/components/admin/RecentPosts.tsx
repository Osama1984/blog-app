import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'

async function getRecentPosts() {
  try {
    const posts = await prisma.post.findMany({
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
        }
      }
    })
    return posts
  } catch (error) {
    console.error('Error fetching recent posts:', error)
    return []
  }
}

export async function RecentPosts() {
  const posts = await getRecentPosts()

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Recent Posts
          </h3>
          <Link
            href="/admin/posts"
            className="text-sm font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
          >
            View all
          </Link>
        </div>
        
        <div className="flow-root">
          <ul className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
            {posts.length === 0 ? (
              <li className="py-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">No posts found</p>
              </li>
            ) : (
              posts.map((post) => (
                <li key={post.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {post.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        By {post.author.name || post.author.email} • {formatDate(post.createdAt)}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.status === 'PUBLISHED'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}
                      >
                        {post.status.toLowerCase()}
                      </span>
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

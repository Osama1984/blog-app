import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatRelativeTime } from '@/lib/utils'
import { 
  CheckIcon, 
  XMarkIcon, 
  EyeIcon,
  TrashIcon 
} from '@heroicons/react/24/outline'

async function getComments() {
  try {
    const comments = await prisma.comment.findMany({
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
    console.error('Error fetching comments:', error)
    return []
  }
}

export async function CommentsTable() {
  const comments = await getComments()

  if (comments.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No comments found</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Comments from users will appear here when they interact with your posts.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Comment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Post
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {comments.map((comment) => (
              <tr key={comment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {(comment.author.name || comment.author.email).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {comment.author.name || 'Anonymous'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {comment.author.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white max-w-xs">
                    <p className="line-clamp-3">
                      {comment.content.length > 100 
                        ? `${comment.content.substring(0, 100)}...` 
                        : comment.content}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/blog/${comment.post.slug}`}
                    className="text-sm text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    {comment.post.title.length > 30 
                      ? `${comment.post.title.substring(0, 30)}...` 
                      : comment.post.title}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      comment.status === 'APPROVED'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}
                  >
                    {comment.status === 'APPROVED' ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatRelativeTime(comment.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/blog/${comment.post.slug}#comment-${comment.id}`}
                      className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      title="View comment"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Link>
                    {comment.status !== 'APPROVED' && (
                      <button
                        className="text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
                        title="Approve comment"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </button>
                    )}
                    {comment.status === 'APPROVED' && (
                      <button
                        className="text-yellow-600 hover:text-yellow-500 dark:text-yellow-400 dark:hover:text-yellow-300"
                        title="Unapprove comment"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      className="text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
                      title="Delete comment"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { 
  DocumentTextIcon, 
  HeartIcon, 
  ChatBubbleLeftIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'

async function getDashboardStats(userId: string) {
  const [posts, likes, comments] = await Promise.all([
    prisma.post.count({
      where: { authorId: userId }
    }),
    prisma.like.count({
      where: { userId: userId }
    }),
    prisma.comment.count({
      where: { authorId: userId }
    })
  ])

  return {
    posts,
    likes,
    comments,
    views: 0 // Placeholder for now
  }
}

async function getRecentPosts(userId: string) {
  return prisma.post.findMany({
    where: { authorId: userId },
    include: {
      _count: {
        select: {
          comments: true,
          likes: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  })
}

export default async function Dashboard() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return <div>Loading...</div>
  }

  const [stats, recentPosts] = await Promise.all([
    getDashboardStats(session.user.id),
    getRecentPosts(session.user.id)
  ])

  const statCards = [
    {
      title: 'My Posts',
      value: stats.posts,
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
      href: '/dashboard/posts'
    },
    {
      title: 'Total Views',
      value: stats.views.toLocaleString(),
      icon: EyeIcon,
      color: 'bg-green-500',
      href: '/dashboard/posts'
    },
    {
      title: 'My Likes',
      value: stats.likes,
      icon: HeartIcon,
      color: 'bg-red-500',
      href: '/dashboard/likes'
    },
    {
      title: 'My Comments',
      value: stats.comments,
      icon: ChatBubbleLeftIcon,
      color: 'bg-purple-500',
      href: '/dashboard/comments'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            href={stat.href}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Posts</h2>
            <Link
              href="/dashboard/posts"
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              View all posts
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          {recentPosts.length === 0 ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No posts yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first post.
              </p>
              <div className="mt-6">
                <Link
                  href="/dashboard/posts/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Create Post
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="hover:text-blue-600"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(post.createdAt).toLocaleDateString()} • {post.status}
                    </p>
                    {post.excerpt && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 ml-4">
                    <div className="flex items-center">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      0
                    </div>
                    <div className="flex items-center">
                      <HeartIcon className="h-4 w-4 mr-1" />
                      {post._count?.likes || 0}
                    </div>
                    <div className="flex items-center">
                      <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                      {post._count?.comments || 0}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/posts/create"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <DocumentTextIcon className="h-8 w-8 text-gray-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">Create New Post</h3>
              <p className="text-xs text-gray-500">Write and publish a new blog post</p>
            </div>
          </Link>
          
          <Link
            href="/dashboard/profile"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <svg className="h-8 w-8 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Update Profile</h3>
              <p className="text-xs text-gray-500">Edit your profile information</p>
            </div>
          </Link>
          
          <Link
            href="/blog"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <EyeIcon className="h-8 w-8 text-gray-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">View Blog</h3>
              <p className="text-xs text-gray-500">See your published posts</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

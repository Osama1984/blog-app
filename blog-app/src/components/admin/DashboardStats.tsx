import { prisma } from '@/lib/prisma'
import { 
  DocumentTextIcon,
  UsersIcon,
  EyeIcon,
  ChatBubbleLeftIcon 
} from '@heroicons/react/24/outline'

async function getStats() {
  try {
    const [postsCount, usersCount, categoriesCount] = await Promise.all([
      prisma.post.count(),
      prisma.user.count(),
      prisma.category.count(),
    ])

    // Mock view count for now - you can implement proper analytics later
    const totalViews = 12543

    return {
      posts: postsCount,
      users: usersCount,
      categories: categoriesCount,
      views: totalViews,
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return {
      posts: 0,
      users: 0,
      categories: 0,
      views: 0,
    }
  }
}

export async function DashboardStats() {
  const stats = await getStats()

  const statItems = [
    {
      name: 'Total Posts',
      value: stats.posts,
      icon: DocumentTextIcon,
      change: '+4.75%',
      changeType: 'positive' as const,
    },
    {
      name: 'Authors',
      value: stats.users,
      icon: UsersIcon,
      change: '+2.02%',
      changeType: 'positive' as const,
    },
    {
      name: 'Categories',
      value: stats.categories,
      icon: ChatBubbleLeftIcon,
      change: '+1.40%',
      changeType: 'positive' as const,
    },
    {
      name: 'Total Views',
      value: stats.views.toLocaleString(),
      icon: EyeIcon,
      change: '+10.18%',
      changeType: 'positive' as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <div
          key={item.name}
          className="relative bg-white dark:bg-gray-800 pt-5 px-4 pb-4 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <div>
            <div className="absolute bg-purple-500 rounded-md p-3">
              <item.icon className="h-6 w-6 text-white" />
            </div>
            <p className="ml-16 text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
              {item.name}
            </p>
          </div>
          <div className="ml-16 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {item.value}
            </p>
            <p
              className={`ml-2 flex items-baseline text-sm font-semibold ${
                item.changeType === 'positive'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {item.change}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

import Link from 'next/link'
import {
  PlusIcon,
  DocumentDuplicateIcon,
  UsersIcon,
  CogIcon
} from '@heroicons/react/24/outline'

const actions = [
  {
    name: 'Create New Post',
    description: 'Write a new blog post',
    href: '/admin/posts/new',
    icon: PlusIcon,
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    name: 'Manage Categories',
    description: 'Add or edit categories',
    href: '/admin/categories',
    icon: DocumentDuplicateIcon,
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    name: 'Manage Users',
    description: 'View and manage users',
    href: '/admin/users',
    icon: UsersIcon,
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    name: 'Settings',
    description: 'Configure blog settings',
    href: '/admin/settings',
    icon: CogIcon,
    color: 'bg-gray-500 hover:bg-gray-600'
  }
]

export function QuickActions() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="relative group bg-white dark:bg-gray-700 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-500 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200"
            >
              <div>
                <span className={`rounded-lg inline-flex p-3 ${action.color} text-white ring-4 ring-white`}>
                  <action.icon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  <span className="absolute inset-0" />
                  {action.name}
                </h4>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {action.description}
                </p>
              </div>
              <span
                className="pointer-events-none absolute top-6 right-6 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

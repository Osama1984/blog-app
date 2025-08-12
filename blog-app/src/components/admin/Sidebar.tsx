'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon,
  DocumentTextIcon,
  UsersIcon,
  TagIcon,
  FolderIcon,
  ChatBubbleLeftIcon,
  CogIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Overview', href: '/admin', icon: HomeIcon, description: 'Dashboard & statistics' },
  { name: 'Posts', href: '/admin/posts', icon: DocumentTextIcon, description: 'Manage blog posts' },
  { name: 'Categories', href: '/admin/categories', icon: FolderIcon, description: 'Organize content' },
  { name: 'Tags', href: '/admin/tags', icon: TagIcon, description: 'Label your posts' },
  { name: 'Comments', href: '/admin/comments', icon: ChatBubbleLeftIcon, description: 'Moderate discussions' },
  { name: 'Users', href: '/admin/users', icon: UsersIcon, description: 'User management' },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon, description: 'Performance insights' },
  { name: 'Settings', href: '/admin/settings', icon: CogIcon, description: 'System configuration' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Header */}
        <div className="flex-shrink-0 p-6">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Squares2X2Icon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Admin Panel
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Blog Management
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 pb-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-start px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <item.icon 
                  className={`flex-shrink-0 h-5 w-5 mt-0.5 mr-3 transition-colors ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                  }`} 
                />
                <div className="flex-1 min-w-0">
                  <div className={`font-medium ${isActive ? 'text-white' : ''}`}>
                    {item.name}
                  </div>
                  <div className={`text-xs mt-0.5 ${
                    isActive 
                      ? 'text-purple-100' 
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                  }`}>
                    {item.description}
                  </div>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
            System Online
          </div>
          <button className="mt-3 w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

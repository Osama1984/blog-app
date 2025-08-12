'use client'

import { useSession } from 'next-auth/react'
import { BellIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function DashboardHeader() {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Page title will be set by individual pages */}
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}!
            </h1>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-500 relative">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 transform translate-x-1/2 -translate-y-1/2"></span>
            </button>

            {/* Quick Actions */}
            <Link
              href="/dashboard/posts/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Post
            </Link>

            <Link
              href="/blog"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Blog
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

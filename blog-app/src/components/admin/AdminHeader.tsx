'use client'

import { 
  BellIcon, 
  MagnifyingGlassIcon,
  ChevronDownIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon
} from '@heroicons/react/24/outline'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useState } from 'react'

export function AdminHeader() {
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  return (
    <div className="lg:pl-72">
      <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex-1 px-4 sm:px-6 flex justify-between items-center">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Search */}
          <div className="flex-1 flex justify-center lg:justify-start">
            <div className="w-full max-w-lg lg:max-w-xs">
              <label htmlFor="search-field" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 ml-3" />
                </div>
                <input
                  id="search-field"
                  className="block w-full h-10 pl-10 pr-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Search everything..."
                  type="search"
                />
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="ml-4 flex items-center space-x-3">
            {/* Notifications */}
            <button
              type="button"
              className="relative p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-5 w-5" />
              {/* Notification badge */}
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white dark:ring-gray-900"></span>
            </button>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Profile dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 text-sm rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">AD</span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="font-medium">Admin User</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">admin@blog.com</div>
                </div>
                <ChevronDownIcon className="h-4 w-4" />
              </button>

              {/* Dropdown menu */}
              {showProfileMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <a
                      href="#"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <UserCircleIcon className="h-4 w-4 mr-3" />
                      Your Profile
                    </a>
                    <a
                      href="#"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Cog6ToothIcon className="h-4 w-4 mr-3" />
                      Settings
                    </a>
                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                    <a
                      href="#"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                      Sign out
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useTheme } from '@/components/providers/ThemeProvider'
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
    )
  }

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <SunIcon className="h-5 w-5" />
      case 'dark':
        return <MoonIcon className="h-5 w-5" />
      case 'system':
        return <ComputerDesktopIcon className="h-5 w-5" />
      default:
        return <SunIcon className="h-5 w-5" />
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="group relative h-9 w-9 rounded-lg bg-gray-100 p-2 text-gray-600 transition-all duration-300 hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
      title={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} mode`}
    >
      <div className="transition-transform duration-300 hover:scale-110">
        {getIcon()}
      </div>
      
      {/* Tooltip */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:bg-gray-700">
        {theme === 'light' ? 'Dark' : theme === 'dark' ? 'System' : 'Light'} mode
      </div>
    </button>
  )
}

'use client'

import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'
import { useTheme } from './ThemeProvider'
import { useState, useRef, useEffect } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const themes = [
    { 
      name: 'Light', 
      value: 'light' as const, 
      icon: SunIcon,
      description: 'Light mode'
    },
    { 
      name: 'Dark', 
      value: 'dark' as const, 
      icon: MoonIcon,
      description: 'Dark mode'
    },
    { 
      name: 'System', 
      value: 'system' as const, 
      icon: ComputerDesktopIcon,
      description: 'Follow system preference'
    },
  ]

  const currentTheme = themes.find(t => t.value === theme) || themes[2]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="Toggle theme"
        title={`Current theme: ${currentTheme.name}`}
      >
        <currentTheme.icon className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 z-50 animate-fade-in">
          <div className="py-1">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon
              return (
                <button
                  key={themeOption.value}
                  onClick={() => {
                    setTheme(themeOption.value)
                    setIsOpen(false)
                  }}
                  className={`
                    flex items-center w-full px-4 py-2 text-sm transition-colors
                    ${theme === themeOption.value 
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">{themeOption.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {themeOption.description}
                    </div>
                  </div>
                  {theme === themeOption.value && (
                    <div className="ml-auto">
                      <div className="h-2 w-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

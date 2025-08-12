'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Bars3Icon, XMarkIcon, UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const userMenuRef = useRef<HTMLDivElement>(null)

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-foreground hover:text-primary transition-colors duration-300">
              <span className="text-gradient">Blog</span>App
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-border/50">
              <ThemeToggle />
              
              {status === 'loading' ? (
                <div className="w-8 h-8 bg-accent/50 rounded-full animate-pulse"></div>
              ) : session?.user ? (
                <div className="relative" ref={userMenuRef}>
                  {/* User Menu Button */}
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
                  >
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="w-8 h-8" />
                    )}
                    <span className="font-medium">{session.user.name || session.user.email}</span>
                    <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg z-50">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-medium text-foreground">{session.user.name}</p>
                        <p className="text-sm text-muted-foreground">{session.user.email}</p>
                        {session.user.role && (
                          <p className="text-xs text-primary font-medium mt-1">
                            {session.user.role.charAt(0).toUpperCase() + session.user.role.slice(1)}
                          </p>
                        )}
                      </div>
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        {session.user.role === 'admin' && (
                          <Link
                            href="/admin"
                            className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Admin Panel
                          </Link>
                        )}
                        <hr className="my-1 border-border" />
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="btn-primary"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

                {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 bg-surface/50 backdrop-blur-sm">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-border/50 pt-4 mt-4 space-y-2">
                {session?.user ? (
                  <>
                    {/* User Info */}
                    <div className="px-4 py-3 bg-accent/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {session.user.image ? (
                          <Image
                            src={session.user.image}
                            alt={session.user.name || 'User'}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <UserCircleIcon className="w-10 h-10 text-muted-foreground" />
                        )}
                        <div>
                          <p className="font-medium text-foreground">{session.user.name}</p>
                          <p className="text-sm text-muted-foreground">{session.user.email}</p>
                          {session.user.role && (
                            <p className="text-xs text-primary font-medium">
                              {session.user.role.charAt(0).toUpperCase() + session.user.role.slice(1)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* User Menu Items */}
                    <Link
                      href="/dashboard"
                      className="block px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </Link>
                    {session.user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="block px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleSignOut()
                        setIsOpen(false)
                      }}
                      className="block w-full text-left px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 font-medium"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      className="block px-4 py-3 text-muted-foreground hover:text-foreground transition-colors font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="btn-primary block text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

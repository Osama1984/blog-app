import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if it's an API route that needs protection
  if (pathname.startsWith('/api/user/') || pathname.startsWith('/api/posts/user/')) {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  }

  // Check if it's an admin route
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const session = await auth()
    
    console.log('Admin route middleware - pathname:', pathname)
    console.log('Admin route middleware - session:', session)
    console.log('Admin route middleware - user role:', session?.user?.role)
    console.log('Admin route middleware - role type:', typeof session?.user?.role)
    
    if (!session) {
      console.log('No session, redirecting to signin')
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    if (session.user?.role !== 'ADMIN') {
      console.log('User role is not ADMIN, redirecting to dashboard. Role:', session.user?.role)
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    
    console.log('User is ADMIN, allowing access to admin route')
  }

  // Check if it's a dashboard route
  if (pathname.startsWith('/dashboard')) {
    const session = await auth()
    
    if (!session) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/api/user/:path*',
    '/api/posts/user/:path*'
  ]
}

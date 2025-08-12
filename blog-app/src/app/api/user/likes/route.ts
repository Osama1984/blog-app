import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/user/likes - Get user's liked posts
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const likes = await prisma.like.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        post: {
          include: {
            author: {
              select: {
                name: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: likes
    })
  } catch (error) {
    console.error('Error fetching user likes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch likes' },
      { status: 500 }
    )
  }
}

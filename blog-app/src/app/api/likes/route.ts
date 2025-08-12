import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get like status for a post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }

    // Get total likes count for the post
    const likesCount = await prisma.like.count({
      where: {
        postId: postId,
      },
    })

    return NextResponse.json({
      success: true,
      likesCount,
    })
  } catch (error) {
    console.error('Error fetching likes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch likes' },
      { status: 500 }
    )
  }
}

// POST - Toggle like for a post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { postId, userEmail, userName } = body

    if (!postId || !userEmail || !userName) {
      return NextResponse.json(
        { error: 'Post ID, user email, and user name are required' },
        { status: 400 }
      )
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: userEmail },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userEmail,
          name: userName,
        },
      })
    }

    // Check if user already liked this post
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: user.id,
        postId: postId,
      },
    })

    if (existingLike) {
      // Unlike the post
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      })

      const likesCount = await prisma.like.count({
        where: { postId: postId },
      })

      return NextResponse.json({
        success: true,
        action: 'unliked',
        likesCount,
        isLiked: false,
      })
    } else {
      // Like the post
      await prisma.like.create({
        data: {
          userId: user.id,
          postId: postId,
        },
      })

      const likesCount = await prisma.like.count({
        where: { postId: postId },
      })

      return NextResponse.json({
        success: true,
        action: 'liked',
        likesCount,
        isLiked: true,
      })
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    )
  }
}

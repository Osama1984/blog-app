import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(200),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  coverImage: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional().default('DRAFT'),
  featured: z.boolean().optional().default(false),
  authorId: z.string().min(1, 'Author is required'),
  categoryIds: z.array(z.string()).optional().default([]),
  tagIds: z.array(z.string()).optional().default([]),
  images: z.array(z.object({
    id: z.string().optional(),
    url: z.string(),
    alt: z.string().optional(),
    caption: z.string().optional(),
    order: z.number().optional().default(0)
  })).optional().default([])
})

// GET /api/admin/posts - List all posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    
    const skip = (page - 1) * limit
    
    // Build where clause
    const where: Prisma.PostWhereInput = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } }
      ]
    }
    
    if (status && ['DRAFT', 'PUBLISHED'].includes(status)) {
      where.status = status as 'DRAFT' | 'PUBLISHED'
    }

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          author: {
            select: { id: true, name: true, email: true }
          },
          categories: {
            include: {
              category: {
                select: { id: true, name: true, slug: true, color: true }
              }
            }
          },
          tags: {
            include: {
              tag: {
                select: { id: true, name: true, slug: true }
              }
            }
          },
          comments: {
            select: { id: true }
          },
          likes: {
            select: { id: true }
          }
        }
      }),
      prisma.post.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// POST /api/admin/posts - Create new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = postSchema.parse(body)

    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingPost) {
      return NextResponse.json(
        { success: false, error: 'Post with this slug already exists' },
        { status: 400 }
      )
    }

    // Check if author exists
    const author = await prisma.user.findUnique({
      where: { id: validatedData.authorId }
    })

    if (!author) {
      return NextResponse.json(
        { success: false, error: 'Author not found' },
        { status: 400 }
      )
    }

    // Create post with categories and tags
    const post = await prisma.post.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        excerpt: validatedData.excerpt,
        content: validatedData.content,
        coverImage: validatedData.coverImage,
        status: validatedData.status,
        featured: validatedData.featured,
        authorId: validatedData.authorId,
        categories: {
          create: validatedData.categoryIds.map(categoryId => ({
            category: { connect: { id: categoryId } }
          }))
        },
        tags: {
          create: validatedData.tagIds.map(tagId => ({
            tag: { connect: { id: tagId } }
          }))
        }
      },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        categories: {
          include: {
            category: {
              select: { id: true, name: true, slug: true, color: true }
            }
          }
        },
        tags: {
          include: {
            tag: {
              select: { id: true, name: true, slug: true }
            }
          }
        },
        comments: {
          select: { id: true }
        },
        likes: {
          select: { id: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: post,
      message: 'Post created successfully'
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: error.issues
        },
        { status: 400 }
      )
    }

    console.error('Error creating post:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    )
  }
}

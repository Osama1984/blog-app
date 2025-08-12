import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/analytics - Get analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days

    const periodDays = parseInt(period)
    const periodStart = new Date()
    periodStart.setDate(periodStart.getDate() - periodDays)

    // Get basic counts
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalUsers,
      totalCategories,
      totalTags,
      totalComments,
      recentComments,
      topCategories,
      topTags,
      userStats,
      postStats
    ] = await Promise.all([
      // Total posts
      prisma.post.count(),
      
      // Published posts
      prisma.post.count({
        where: { status: 'PUBLISHED' }
      }),
      
      // Draft posts
      prisma.post.count({
        where: { status: 'DRAFT' }
      }),
      
      // Total users
      prisma.user.count(),
      
      // Total categories
      prisma.category.count(),
      
      // Total tags
      prisma.tag.count(),
      
      // Total comments
      prisma.comment.count({
        where: {
          createdAt: {
            gte: periodStart
          }
        }
      }),
      
      // Recent comments
      prisma.comment.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        where: {
          createdAt: {
            gte: periodStart
          }
        },
        include: {
          author: {
            select: { name: true, email: true, image: true }
          },
          post: {
            select: { title: true, slug: true }
          }
        }
      }),
      
      // Top categories by post count
      prisma.category.findMany({
        include: {
          posts: {
            select: { id: true },
            where: {
              post: {
                status: 'PUBLISHED',
                createdAt: {
                  gte: periodStart
                }
              }
            }
          }
        },
        orderBy: {
          posts: {
            _count: 'desc'
          }
        },
        take: 5
      }),
      
      // Top tags by post count
      prisma.tag.findMany({
        include: {
          posts: {
            select: { id: true },
            where: {
              post: {
                status: 'PUBLISHED',
                createdAt: {
                  gte: periodStart
                }
              }
            }
          }
        },
        orderBy: {
          posts: {
            _count: 'desc'
          }
        },
        take: 5
      }),
      
      // User registration stats
      prisma.user.groupBy({
        by: ['role'],
        _count: {
          id: true
        },
        where: {
          createdAt: {
            gte: periodStart
          }
        }
      }),
      
      // Post creation stats by status
      prisma.post.groupBy({
        by: ['status'],
        _count: {
          id: true
        },
        where: {
          createdAt: {
            gte: periodStart
          }
        }
      })
    ])

    // Get recent posts with engagement
    const recentPosts = await prisma.post.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      where: {
        status: 'PUBLISHED',
        createdAt: {
          gte: periodStart
        }
      },
      include: {
        author: {
          select: { name: true, email: true }
        },
        comments: {
          select: { id: true }
        },
        likes: {
          select: { id: true }
        },
        categories: {
          include: {
            category: {
              select: { name: true, color: true }
            }
          }
        }
      }
    })

    // Get daily post creation over the period
    const dailyPosts = await prisma.$queryRaw`
      SELECT 
        DATE(createdAt) as date,
        COUNT(*) as count,
        status
      FROM posts 
      WHERE createdAt >= ${periodStart}
      GROUP BY DATE(createdAt), status
      ORDER BY date DESC
      LIMIT 30
    ` as Array<{ date: string; count: bigint; status: string }>

    // Get daily user registrations
    const dailyUsers = await prisma.$queryRaw`
      SELECT 
        DATE(createdAt) as date,
        COUNT(*) as count
      FROM users 
      WHERE createdAt >= ${periodStart}
      GROUP BY DATE(createdAt)
      ORDER BY date DESC
      LIMIT 30
    ` as Array<{ date: string; count: bigint }>

    // Calculate growth rates (simplified)
    const previousPeriodStart = new Date(periodStart)
    previousPeriodStart.setDate(previousPeriodStart.getDate() - periodDays)

    const [prevComments, prevPosts, prevUsers] = await Promise.all([
      prisma.comment.count({
        where: {
          createdAt: {
            gte: previousPeriodStart,
            lt: periodStart
          }
        }
      }),
      prisma.post.count({
        where: {
          createdAt: {
            gte: previousPeriodStart,
            lt: periodStart
          }
        }
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: previousPeriodStart,
            lt: periodStart
          }
        }
      })
    ])

    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0
      return Math.round(((current - previous) / previous) * 100)
    }

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalPosts,
          publishedPosts,
          draftPosts,
          totalUsers,
          totalCategories,
          totalTags,
          totalComments,
          growth: {
            comments: calculateGrowth(totalComments, prevComments),
            posts: calculateGrowth(recentPosts.length, prevPosts),
            users: calculateGrowth(userStats.reduce((acc, stat) => acc + stat._count.id, 0), prevUsers)
          }
        },
        recentPosts: recentPosts.map(post => ({
          ...post,
          commentsCount: post.comments.length,
          likesCount: post.likes.length
        })),
        recentComments,
        topCategories: topCategories.map(cat => ({
          ...cat,
          postsCount: cat.posts.length
        })),
        topTags: topTags.map(tag => ({
          ...tag,
          postsCount: tag.posts.length
        })),
        userStats,
        postStats,
        charts: {
          dailyPosts: dailyPosts.map(item => ({
            date: item.date,
            count: Number(item.count),
            status: item.status
          })),
          dailyUsers: dailyUsers.map(item => ({
            date: item.date,
            count: Number(item.count)
          }))
        },
        period: periodDays
      }
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

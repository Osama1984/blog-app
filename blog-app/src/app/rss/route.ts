import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 20, // Limit to latest 20 posts
    })

    const siteUrl = process.env.APP_URL || 'http://localhost:3000'
    const buildDate = new Date().toUTCString()

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog App</title>
    <description>A modern blog application built with Next.js</description>
    <link>${siteUrl}</link>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/rss" rel="self" type="application/rss+xml"/>
    
    ${posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt || ''}]]></description>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${post.publishedAt?.toUTCString() || ''}</pubDate>
      <author>${post.author?.name || 'Anonymous'}</author>
      ${post.categories.map(({ category }) => `<category>${category.name}</category>`).join('')}
    </item>
    `).join('')}
  </channel>
</rss>`

    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=1200, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('RSS generation error:', error)
    return new NextResponse('Error generating RSS feed', { status: 500 })
  }
}

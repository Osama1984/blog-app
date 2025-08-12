import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const siteUrl = process.env.APP_URL || 'http://localhost:3000'
    
    // Get all published posts
    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
      },
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    // Get all categories
    const categories = await prisma.category.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    // Get all tags
    const tags = await prisma.tag.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    // Get all authors with published posts
    const authors = await prisma.user.findMany({
      where: {
        posts: {
          some: {
            status: 'PUBLISHED',
          },
        },
      },
      select: {
        id: true,
        updatedAt: true,
      },
    })

    const currentDate = new Date().toISOString()

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static pages -->
  <url>
    <loc>${siteUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${siteUrl}/categories</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/tags</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/authors</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/privacy</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${siteUrl}/terms</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

  <!-- Blog posts -->
  ${posts.map(post => `
  <url>
    <loc>${siteUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  `).join('')}

  <!-- Categories -->
  ${categories.map(category => `
  <url>
    <loc>${siteUrl}/blog/category/${category.slug}</loc>
    <lastmod>${category.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  `).join('')}

  <!-- Tags -->
  ${tags.map(tag => `
  <url>
    <loc>${siteUrl}/blog/tag/${tag.slug}</loc>
    <lastmod>${tag.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
  `).join('')}

  <!-- Authors -->
  ${authors.map(author => `
  <url>
    <loc>${siteUrl}/authors/${author.id}</loc>
    <lastmod>${author.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  `).join('')}
</urlset>`

    return new NextResponse(sitemapXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      },
    })
  } catch (error) {
    console.error('Sitemap generation error:', error)
    return new NextResponse('Error generating sitemap', { status: 500 })
  }
}

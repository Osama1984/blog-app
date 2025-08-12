import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import Pagination from '@/components/ui/Pagination'

interface TagsPageProps {
  searchParams: Promise<{
    page?: string
  }>
}

export default async function TagsPage({ searchParams }: TagsPageProps) {
  const { page } = await searchParams
  const currentPage = Number(page) || 1
  const tagsPerPage = 24
  const skip = (currentPage - 1) * tagsPerPage

  const [tags, totalTags] = await Promise.all([
    prisma.tag.findMany({
      include: {
        posts: {
          where: {
            post: {
              status: 'PUBLISHED',
            },
          },
          select: {
            post: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
      skip,
      take: tagsPerPage,
    }),
    prisma.tag.count()
  ])

  const totalPages = Math.ceil(totalTags / tagsPerPage)

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Explore</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Tags
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Browse posts by specific topics and technologies.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <div className="flex flex-wrap gap-4 justify-center">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog/tag/${tag.slug}`}
                className="group relative inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-blue-50 rounded-full transition-colors"
              >
                <span className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                  #{tag.name}
                </span>
                <span className="ml-2 text-sm text-gray-500 group-hover:text-blue-500">
                  ({tag.posts.length})
                </span>
              </Link>
            ))}
          </div>

          {tags.length === 0 && (
            <div className="text-center">
              <p className="text-gray-500">No tags found.</p>
            </div>
          )}
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl="/tags"
          />
        </div>
      </div>
    </div>
  )
}

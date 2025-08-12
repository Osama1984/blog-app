import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import Pagination from '@/components/ui/Pagination'

interface AuthorsPageProps {
  searchParams: Promise<{
    page?: string
  }>
}

export default async function AuthorsPage({ searchParams }: AuthorsPageProps) {
  const { page } = await searchParams
  const currentPage = Number(page) || 1
  const authorsPerPage = 12
  const skip = (currentPage - 1) * authorsPerPage

  const [authors, totalAuthors] = await Promise.all([
    prisma.user.findMany({
      where: {
        posts: {
          some: {
            status: 'PUBLISHED',
          },
        },
      },
      include: {
        posts: {
          where: {
            status: 'PUBLISHED',
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
      skip,
      take: authorsPerPage,
    }),
    prisma.user.count({
      where: {
        posts: {
          some: {
            status: 'PUBLISHED',
          },
        },
      },
    })
  ])

  const totalPages = Math.ceil(totalAuthors / authorsPerPage)

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Meet</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Authors
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Get to know the talented writers behind our content.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
            {authors.map((author) => (
              <div
                key={author.id}
                className="flex flex-col items-center text-center"
              >
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                  {author.image ? (
                    <Image
                      src={author.image}
                      alt={author.name || 'Author'}
                      width={96}
                      height={96}
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-gray-600">
                      {author.name?.charAt(0) || 'A'}
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900">
                  {author.name || 'Anonymous'}
                </h3>
                
                {author.bio && (
                  <p className="mt-2 text-sm text-gray-600 max-w-xs">
                    {author.bio}
                  </p>
                )}
                
                <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                  <span>{author.posts.length} posts</span>
                  <span className="capitalize">{author.role.toLowerCase()}</span>
                </div>
                
                <Link
                  href={`/authors/${author.id}`}
                  className="mt-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View Posts
                </Link>
              </div>
            ))}
          </div>

          {authors.length === 0 && (
            <div className="text-center">
              <p className="text-gray-500">No authors found.</p>
            </div>
          )}
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl="/authors"
          />
        </div>
      </div>
    </div>
  )
}

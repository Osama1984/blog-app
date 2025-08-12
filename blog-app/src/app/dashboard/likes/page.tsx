'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { HeartIcon } from '@heroicons/react/24/solid'

interface LikedPost {
  id: string
  createdAt: string
  post: {
    id: string
    title: string
    excerpt: string
    coverImage?: string
    slug: string
    author: {
      name: string
      image?: string
    }
    createdAt: string
  }
}

function formatTimeAgo(date: string) {
  const now = new Date()
  const past = new Date(date)
  const diffInMs = now.getTime() - past.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return '1 day ago'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  return `${Math.floor(diffInDays / 30)} months ago`
}

export default function MyLikes() {
  const { data: session } = useSession()
  const [likes, setLikes] = useState<LikedPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await fetch('/api/user/likes')
        const data = await response.json()
        
        if (data.success) {
          setLikes(data.data)
        }
      } catch (error) {
        console.error('Error fetching likes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchLikes()
    }
  }, [session])

  if (!session) {
    return <div>Please sign in to view your likes.</div>
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-900 flex items-center">
            <HeartIcon className="h-5 w-5 text-red-500 mr-2" />
            My Liked Posts ({likes.length})
          </h1>
        </div>
        
        <div className="p-6">
          {likes.length === 0 ? (
            <div className="text-center py-12">
              <HeartIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No liked posts yet</h3>
              <p className="text-gray-500 mb-4">Start exploring and like posts you enjoy!</p>
              <Link
                href="/blog"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse Posts
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {likes.map((like) => (
                <div key={like.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    {like.post.coverImage && (
                      <div className="flex-shrink-0">
                        <Image
                          src={like.post.coverImage}
                          alt={like.post.title}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/blog/${like.post.slug}`}
                          className="text-lg font-medium text-gray-900 hover:text-blue-600 truncate"
                        >
                          {like.post.title}
                        </Link>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          Liked {formatTimeAgo(like.createdAt)}
                        </span>
                      </div>
                      
                      {like.post.excerpt && (
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {like.post.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center mt-3 space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          {like.post.author.image && (
                            <Image
                              src={like.post.author.image}
                              alt={like.post.author.name}
                              width={20}
                              height={20}
                              className="w-5 h-5 rounded-full mr-2"
                            />
                          )}
                          <span>by {like.post.author.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatTimeAgo(like.post.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

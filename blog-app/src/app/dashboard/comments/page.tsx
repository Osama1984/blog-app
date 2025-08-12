'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { ChatBubbleLeftIcon, TrashIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

interface UserComment {
  id: string
  content: string
  createdAt: string
  post: {
    id: string
    title: string
    slug: string
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

export default function MyComments() {
  const { data: session } = useSession()
  const [comments, setComments] = useState<UserComment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch('/api/user/comments')
        const data = await response.json()
        
        if (data.success) {
          setComments(data.data)
        }
      } catch (error) {
        console.error('Error fetching comments:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchComments()
    }
  }, [session])

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      const response = await fetch(`/api/user/comments/${commentId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setComments(prev => prev.filter(comment => comment.id !== commentId))
        toast.success('Comment deleted successfully')
      } else {
        toast.error('Failed to delete comment')
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      toast.error('Failed to delete comment')
    }
  }

  if (!session) {
    return <div>Please sign in to view your comments.</div>
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
            <ChatBubbleLeftIcon className="h-5 w-5 text-blue-500 mr-2" />
            My Comments ({comments.length})
          </h1>
        </div>
        
        <div className="p-6">
          {comments.length === 0 ? (
            <div className="text-center py-12">
              <ChatBubbleLeftIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h3>
              <p className="text-gray-500 mb-4">Start engaging with posts by leaving comments!</p>
              <Link
                href="/blog"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse Posts
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <Link
                          href={`/blog/${comment.post.slug}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 truncate"
                        >
                          {comment.post.title}
                        </Link>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                      </div>
                      
                      <div className="text-gray-800 text-sm leading-relaxed">
                        {comment.content}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="ml-4 p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete comment"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
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

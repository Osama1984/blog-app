'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { 
  ChatBubbleLeftIcon, 
  HeartIcon,
  FaceSmileIcon,
  PaperAirplaneIcon 
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface User {
  id: string
  name: string
  email: string
  image?: string
}

interface Comment {
  id: string
  content: string
  createdAt: string
  author: User
  replies: Comment[]
  _count: {
    replies: number
  }
}

interface CommentSectionProps {
  postId: string
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [likesCount, setLikesCount] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  
  // Form state
  const [authorName, setAuthorName] = useState('')
  const [authorEmail, setAuthorEmail] = useState('')
  const [commentContent, setCommentContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`)
      const data = await response.json()
      
      if (data.success) {
        setComments(data.comments)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }, [postId])

  const fetchLikes = useCallback(async () => {
    try {
      const response = await fetch(`/api/likes?postId=${postId}`)
      const data = await response.json()
      
      if (data.success) {
        setLikesCount(data.likesCount)
      }
    } catch (error) {
      console.error('Error fetching likes:', error)
    }
  }, [postId])

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchComments(), fetchLikes()])
    }
    loadData()
  }, [fetchComments, fetchLikes])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!authorName.trim() || !authorEmail.trim() || !commentContent.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          content: commentContent,
          authorName: authorName.trim(),
          authorEmail: authorEmail.trim(),
          parentId: replyingTo,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Comment submitted successfully!')
        setCommentContent('')
        setShowCommentForm(false)
        setReplyingTo(null)
        fetchComments() // Refresh comments
      } else {
        toast.error(data.error || 'Failed to submit comment')
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
      toast.error('Failed to submit comment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLike = async () => {
    if (!authorName.trim() || !authorEmail.trim()) {
      toast.error('Please provide your name and email to like this post')
      return
    }

    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          userEmail: authorEmail.trim(),
          userName: authorName.trim(),
        }),
      })

      const data = await response.json()

      if (data.success) {
        setLikesCount(data.likesCount)
        setIsLiked(data.isLiked)
        toast.success(data.action === 'liked' ? 'Post liked!' : 'Like removed')
      } else {
        toast.error(data.error || 'Failed to toggle like')
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      toast.error('Failed to toggle like')
    }
  }

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setCommentContent(prev => prev + emojiData.emoji)
    setShowEmojiPicker(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-12 border-t pt-8">
      {/* Like Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className="flex items-center space-x-2 text-rose-600 hover:text-rose-700 transition-colors"
          >
            {isLiked ? (
              <HeartSolidIcon className="h-6 w-6" />
            ) : (
              <HeartIcon className="h-6 w-6" />
            )}
            <span className="font-medium">{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
          </button>
          
          <button
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ChatBubbleLeftIcon className="h-6 w-6" />
            <span className="font-medium">{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</span>
          </button>
        </div>
      </div>

      {/* Comment Form */}
      {showCommentForm && (
        <form onSubmit={handleSubmitComment} className="mb-8 bg-gray-50 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Your Name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="relative mb-4">
            <textarea
              placeholder="Write your comment..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
            
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute bottom-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FaceSmileIcon className="h-6 w-6" />
            </button>
            
            {showEmojiPicker && (
              <div className="absolute bottom-12 right-0 z-10">
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  autoFocusSearch={false}
                  searchDisabled
                  height={350}
                  width={300}
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setShowCommentForm(false)
                setReplyingTo(null)
                setCommentContent('')
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
              <span>{submitting ? 'Submitting...' : 'Submit Comment'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ChatBubbleLeftIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {comment.author.name?.charAt(0).toUpperCase() || '?'}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{comment.author.name}</h4>
                    <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                  
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex space-x-3 pl-4 border-l-2 border-gray-100">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {reply.author.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          
                          <div className="flex-1">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="font-medium text-gray-900 text-sm">{reply.author.name}</h5>
                                <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                              </div>
                              <p className="text-gray-700 text-sm whitespace-pre-wrap">{reply.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

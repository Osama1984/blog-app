'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import PostForm from './PostForm'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImage: string | null
  status: 'DRAFT' | 'PUBLISHED'
  featured: boolean
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
  author: {
    id: string
    name: string | null
    email: string
  }
  categories: {
    category: {
      id: string
      name: string
      slug: string
      color: string | null
    }
  }[]
  tags: {
    tag: {
      id: string
      name: string
      slug: string
    }
  }[]
  comments: { id: string }[]
  likes: { id: string }[]
}

export default function PostsTable() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [postToDelete, setPostToDelete] = useState<Post | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [limit] = useState(10)

  const fetchPosts = async (page = 1, search = searchTerm, status = statusFilter) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      })
      
      if (search) params.append('search', search)
      if (status) params.append('status', status)
      
      const response = await fetch(`/api/admin/posts?${params}`)
      const result = await response.json()
      
      if (result.success) {
        setPosts(result.data)
        setFilteredPosts(result.data)
        setCurrentPage(result.pagination.page)
        setTotalPages(result.pagination.totalPages)
        setTotalCount(result.pagination.totalCount)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fix useEffect dependencies
  const fetchPostsCallback = useCallback(() => {
    return fetchPosts(currentPage, searchTerm, statusFilter)
  }, [currentPage, searchTerm, statusFilter, limit])
  
  useEffect(() => {
    fetchPostsCallback()
  }, [fetchPostsCallback])

  // Remove the second useEffect since we handle filtering in the callback

  const handleEdit = (post: Post) => {
    setSelectedPost(post)
    setIsFormOpen(true)
  }

  const handleCreate = () => {
    setSelectedPost(null)
    setIsFormOpen(true)
  }

  const handleDelete = async () => {
    if (!postToDelete) return
    
    setIsDeleting(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/posts/${postToDelete.id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        setSuccess('Post deleted successfully')
        await fetchPosts()
        setShowDeleteModal(false)
        setPostToDelete(null)
        
        // Clear success message
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(result.error || 'Failed to delete post')
      }
    } catch (error) {
      setError('Network error. Please try again.')
      console.error('Error deleting post:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleFormSave = () => {
    fetchPosts()
    setIsFormOpen(false)
    setSelectedPost(null)
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full'
    
    switch (status) {
      case 'PUBLISHED':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'DRAFT':
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
          <FunnelIcon className="h-8 w-8 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
          Get started by creating your first blog post.
        </p>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create First Post
        </button>

        <PostForm
          post={null}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleFormSave}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckIcon className="h-5 w-5 text-green-400 mr-3" />
          <span className="text-sm text-green-700">{success}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-3" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {/* Header with Search and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="ALL">All Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Post
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cover Image
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categories
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        {post.featured && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mr-2">
                            Featured
                          </span>
                        )}
                        {post.title}
                      </div>
                      {post.excerpt && (
                        <div className="text-sm text-gray-500 max-w-xs truncate mt-1">
                          {post.excerpt}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        /{post.slug}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {post.coverImage ? (
                      <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        <span className="text-xs text-gray-400">No image</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {post.author.name || post.author.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(post.status)}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {post.categories.map((postCategory) => (
                        <span
                          key={postCategory.category.id}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                          style={{
                            backgroundColor: postCategory.category.color ? `${postCategory.category.color}20` : '#e5e7eb',
                            color: postCategory.category.color || '#374151'
                          }}
                        >
                          {postCategory.category.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                        className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
                        title="View post"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(post)}
                        className="p-1 text-indigo-600 hover:text-indigo-900 transition-colors"
                        title="Edit post"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setPostToDelete(post)
                          setShowDeleteModal(true)
                        }}
                        className="p-1 text-red-600 hover:text-red-900 transition-colors"
                        title="Delete post"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts found.</p>
          </div>
        )}
      </div>

      {/* Post Form Modal */}
      <PostForm
        post={selectedPost}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setSelectedPost(null)
        }}
        onSave={handleFormSave}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && postToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Delete Post
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to delete &ldquo;{postToDelete.title}&rdquo;? 
                  This action cannot be undone and will also delete all comments and likes.
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setPostToDelete(null)
                    setError('')
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">{(currentPage - 1) * limit + 1}</span>
                {' '}to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * limit, totalCount)}
                </span>
                {' '}of{' '}
                <span className="font-medium">{totalCount}</span>
                {' '}results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  ←
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber
                  if (totalPages <= 5) {
                    pageNumber = i + 1
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i
                  } else {
                    pageNumber = currentPage - 2 + i
                  }
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                        pageNumber === currentPage
                          ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                          : 'text-gray-900'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  )
                })}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  →
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  HashtagIcon
} from '@heroicons/react/24/outline'
import TagForm from './TagForm'

interface Tag {
  id: string
  name: string
  slug: string
  createdAt: Date
  updatedAt: Date
  posts: { id: string }[]
}

export default function TagsTable() {
  const [tags, setTags] = useState<Tag[]>([])
  const [filteredTags, setFilteredTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/admin/tags')
      const result = await response.json()
      
      if (result.success) {
        setTags(result.data)
        setFilteredTags(result.data)
      }
    } catch (error) {
      console.error('Error fetching tags:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  // Filter tags based on search term
  useEffect(() => {
    let filtered = tags

    if (searchTerm) {
      filtered = filtered.filter(tag =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tag.slug.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredTags(filtered)
  }, [searchTerm, tags])

  const handleEdit = (tag: Tag) => {
    setSelectedTag(tag)
    setIsFormOpen(true)
  }

  const handleCreate = () => {
    setSelectedTag(null)
    setIsFormOpen(true)
  }

  const handleDelete = async () => {
    if (!tagToDelete) return
    
    setIsDeleting(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/tags/${tagToDelete.id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        setSuccess('Tag deleted successfully')
        await fetchTags()
        setShowDeleteModal(false)
        setTagToDelete(null)
        
        // Clear success message
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(result.error || 'Failed to delete tag')
      }
    } catch (error) {
      setError('Network error. Please try again.')
      console.error('Error deleting tag:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleFormSave = () => {
    fetchTags()
    setIsFormOpen(false)
    setSelectedTag(null)
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (tags.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
          <HashtagIcon className="h-8 w-8 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No tags found</h3>
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
          Get started by creating your first tag to organize your blog posts.
        </p>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create First Tag
        </button>

        <TagForm
          tag={null}
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
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Tag
        </button>
      </div>

      {/* Tags Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTags.map((tag) => (
              <div
                key={tag.id}
                className="relative group bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <HashtagIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {tag.name}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(tag)}
                      className="p-1 text-indigo-600 hover:text-indigo-900 transition-colors"
                      title="Edit tag"
                    >
                      <PencilIcon className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => {
                        setTagToDelete(tag)
                        setShowDeleteModal(true)
                      }}
                      className="p-1 text-red-600 hover:text-red-900 transition-colors"
                      title="Delete tag"
                    >
                      <TrashIcon className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                    {tag.slug}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                      {tag.posts.length} {tag.posts.length === 1 ? 'post' : 'posts'}
                    </span>
                    <span>{formatDate(tag.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredTags.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tags found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No tags match your search for &ldquo;{searchTerm}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Tag Form Modal */}
      <TagForm
        tag={selectedTag}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setSelectedTag(null)
        }}
        onSave={handleFormSave}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && tagToDelete && (
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
                  Delete Tag
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to delete &ldquo;{tagToDelete.name}&rdquo;? 
                  {tagToDelete.posts.length > 0 && (
                    <span className="block mt-2 text-red-600 font-medium">
                      This tag has {tagToDelete.posts.length} posts and cannot be deleted.
                    </span>
                  )}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setTagToDelete(null)
                    setError('')
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting || tagToDelete.posts.length > 0}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

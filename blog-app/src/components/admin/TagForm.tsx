'use client'

import React, { useState, useEffect } from 'react'

interface Tag {
  id: string
  name: string
  slug: string
  createdAt: Date
  updatedAt: Date
}

interface TagFormProps {
  tag?: Tag | null
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

interface TagFormData {
  name: string
  slug: string
}

export default function TagForm({ tag, isOpen, onClose, onSave }: TagFormProps) {
  const [formData, setFormData] = useState<TagFormData>({
    name: '',
    slug: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Reset form when tag or isOpen changes
  useEffect(() => {
    if (isOpen) {
      if (tag) {
        setFormData({
          name: tag.name || '',
          slug: tag.slug || ''
        })
      } else {
        setFormData({
          name: '',
          slug: ''
        })
      }
      setError('')
    }
  }, [tag, isOpen])

  // Auto-generate slug from name (only for new tags)
  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      // Only auto-generate slug for new tags and if slug is empty
      slug: !tag && !prev.slug ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const url = tag 
        ? `/api/admin/tags/${tag.id}`
        : '/api/admin/tags'
      
      const method = tag ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        onSave()
        onClose()
      } else {
        setError(result.error || 'Failed to save tag')
      }
    } catch (error) {
      console.error('Error saving tag:', error)
      setError('Failed to save tag')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold mb-4">
          {tag ? 'Edit Tag' : 'Create Tag'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter tag name..."
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              Slug
            </label>
            <input
              type="text"
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="tag-slug"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              URL-friendly version of the name (lowercase, hyphens instead of spaces)
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Saving...' : (tag ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

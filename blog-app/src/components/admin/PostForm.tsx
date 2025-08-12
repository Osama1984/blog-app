'use client'

import React, { useState, useEffect } from 'react'
import FileUpload from '@/components/ui/FileUpload'

interface PostFormProps {
  post?: PostFormData | null
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

interface User {
  id: string
  email: string
  name: string
}

interface Category {
  id: string
  name: string
  slug: string
}

interface Tag {
  id: string
  name: string
  slug: string
}

interface FileUploadResult {
  url: string
  name: string
  size: number
}

interface PostFormData {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  status: 'DRAFT' | 'PUBLISHED'
  featured: boolean
  authorId: string
  categoryIds: string[]
  tagIds: string[]
  author?: { id: string }
  categories?: Array<{ category: { id: string } }>
  tags?: Array<{ tag: { id: string } }>
  images?: PostImage[]
}

interface PostImage {
  id?: string
  url: string
  alt: string
  caption: string
  order: number
}

export default function PostForm({ post, isOpen, onClose, onSave }: PostFormProps) {
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    status: 'DRAFT',
    featured: false,
    authorId: '',
    categoryIds: [],
    tagIds: []
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [postImages, setPostImages] = useState<PostImage[]>([])
  const [coverImageFiles, setCoverImageFiles] = useState<Array<{url: string, name: string}>>([])
  const [additionalImageFiles, setAdditionalImageFiles] = useState<Array<{url: string, name: string}>>([])

  const handleCoverImageUpload = async (files: File[]) => {
    if (files.length === 0) return

    try {
      const formDataUpload = new FormData()
      files.forEach(file => formDataUpload.append('files', file))
      formDataUpload.append('type', 'posts')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      })

      const result = await response.json()
      if (result.success && result.files.length > 0) {
        const uploadedFile = result.files[0]
        setFormData(prev => ({ ...prev, coverImage: uploadedFile.url }))
        setCoverImageFiles([{ url: uploadedFile.url, name: uploadedFile.name }])
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError('Failed to upload cover image')
    }
  }

  const handleCoverImageRemove = () => {
    setFormData(prev => ({ ...prev, coverImage: '' }))
    setCoverImageFiles([])
  }

  const handleAdditionalImagesUpload = async (files: File[]) => {
    if (files.length === 0) return

    try {
      const formDataUpload = new FormData()
      files.forEach(file => formDataUpload.append('files', file))
      formDataUpload.append('type', 'posts')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      })

      const result = await response.json()
      if (result.success) {
        const newImages: PostImage[] = result.files.map((file: FileUploadResult, index: number) => ({
          url: file.url,
          alt: '',
          caption: '',
          order: postImages.length + index
        }))
        setPostImages(prev => [...prev, ...newImages])
        setAdditionalImageFiles(prev => [...prev, ...result.files.map((f: FileUploadResult) => ({ url: f.url, name: f.name }))])
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError('Failed to upload additional images')
    }
  }

  const handleAdditionalImageRemove = (index: number) => {
    setPostImages(prev => prev.filter((_, i) => i !== index))
    setAdditionalImageFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Fetch users, categories, and tags for form options
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const [usersRes, categoriesRes, tagsRes] = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/admin/categories'),
          fetch('/api/admin/tags')
        ])

        const [usersData, categoriesData, tagsData] = await Promise.all([
          usersRes.json(),
          categoriesRes.json(),
          tagsRes.json()
        ])

        if (usersData.success) setUsers(usersData.data)
        if (categoriesData.success) setCategories(categoriesData.data)
        if (tagsData.success) setTags(tagsData.data)
      } catch (error) {
        console.error('Error fetching form data:', error)
      }
    }

    if (isOpen) {
      fetchFormData()
    }
  }, [isOpen])

  // Reset form when post or isOpen changes
  useEffect(() => {
    if (isOpen) {
      if (post) {
        setFormData({
          title: post.title || '',
          slug: post.slug || '',
          excerpt: post.excerpt || '',
          content: post.content || '',
          coverImage: post.coverImage || '',
          status: post.status || 'DRAFT',
          featured: post.featured || false,
          authorId: post.author?.id || '',
          categoryIds: post.categories?.map((c: { category: { id: string } }) => c.category.id) || [],
          tagIds: post.tags?.map((t: { tag: { id: string } }) => t.tag.id) || []
        })
        // Set existing cover image
        if (post.coverImage) {
          setCoverImageFiles([{ url: post.coverImage, name: 'Cover Image' }])
        } else {
          setCoverImageFiles([])
        }
        // Set existing post images
        if (post.images) {
          setPostImages(post.images)
          setAdditionalImageFiles(post.images.map((img: PostImage) => ({ url: img.url, name: img.alt || 'Post Image' })))
        } else {
          setPostImages([])
          setAdditionalImageFiles([])
        }
      } else {
        setFormData({
          title: '',
          slug: '',
          excerpt: '',
          content: '',
          coverImage: '',
          status: 'DRAFT',
          featured: false,
          authorId: users[0]?.id || '',
          categoryIds: [],
          tagIds: []
        })
        setCoverImageFiles([])
        setPostImages([])
        setAdditionalImageFiles([])
      }
      setError('')
    }
  }, [post, isOpen, users])

  // Auto-generate slug from title (only for new posts)
  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      // Only auto-generate slug for new posts and if slug is empty
      slug: !post && !prev.slug ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const url = post 
        ? `/api/admin/posts/${post.id}`
        : '/api/admin/posts'
      
      const method = post ? 'PUT' : 'POST'

      // Include post images in the submission
      const submissionData = {
        ...formData,
        images: postImages
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      })

      const result = await response.json()

      if (result.success) {
        onSave()
        onClose()
      } else {
        setError(result.error || 'Failed to save post')
      }
    } catch (error) {
      console.error('Error saving post:', error)
      setError('Failed to save post')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {post ? 'Edit Post' : 'Create Post'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Brief description of the post..."
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={12}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Write your post content..."
                required
              />
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image
              </label>
              <FileUpload
                onFilesSelected={handleCoverImageUpload}
                onFilesRemoved={handleCoverImageRemove}
                existingFiles={coverImageFiles}
                accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'] }}
                maxFiles={1}
                maxSize={10 * 1024 * 1024}
                className="w-full"
              />
            </div>

            {/* Additional Images Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Images
              </label>
              <FileUpload
                onFilesSelected={handleAdditionalImagesUpload}
                onFilesRemoved={handleAdditionalImageRemove}
                existingFiles={additionalImageFiles}
                accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'] }}
                maxFiles={10}
                maxSize={5 * 1024 * 1024}
                multiple
                className="w-full"
              />
              {postImages.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600">Image Details:</p>
                  {postImages.map((img, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Alt text"
                          value={img.alt}
                          onChange={(e) => {
                            const updatedImages = [...postImages]
                            updatedImages[index].alt = e.target.value
                            setPostImages(updatedImages)
                          }}
                          className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <input
                          type="text"
                          placeholder="Caption"
                          value={img.caption}
                          onChange={(e) => {
                            const updatedImages = [...postImages]
                            updatedImages[index].caption = e.target.value
                            setPostImages(updatedImages)
                          }}
                          className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <input
                          type="number"
                          placeholder="Order"
                          value={img.order}
                          onChange={(e) => {
                            const updatedImages = [...postImages]
                            updatedImages[index].order = parseInt(e.target.value) || 0
                            setPostImages(updatedImages)
                          }}
                          className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="authorId" className="block text-sm font-medium text-gray-700 mb-2">
                  Author *
                </label>
                <select
                  id="authorId"
                  value={formData.authorId}
                  onChange={(e) => setFormData(prev => ({ ...prev, authorId: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select an author</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name || user.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'DRAFT' | 'PUBLISHED' }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>

              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                  Featured Post
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.categoryIds.includes(category.id)}
                        onChange={(e) => {
                          const checked = e.target.checked
                          setFormData(prev => ({
                            ...prev,
                            categoryIds: checked
                              ? [...prev.categoryIds, category.id]
                              : prev.categoryIds.filter(id => id !== category.id)
                          }))
                        }}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-900">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  {tags.map((tag) => (
                    <label key={tag.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.tagIds.includes(tag.id)}
                        onChange={(e) => {
                          const checked = e.target.checked
                          setFormData(prev => ({
                            ...prev,
                            tagIds: checked
                              ? [...prev.tagIds, tag.id]
                              : prev.tagIds.filter(id => id !== tag.id)
                          }))
                        }}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-900">{tag.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
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
                {isLoading ? 'Saving...' : (post ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

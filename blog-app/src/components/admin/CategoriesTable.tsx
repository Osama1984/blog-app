'use client'

import { useState } from 'react'
import Image from 'next/image'
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import { CategoryForm } from './CategoryForm'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  color: string | null
  image: string | null
  createdAt: Date
  posts: { id: string }[]
}

interface CategoriesTableProps {
  initialCategories: Category[]
}

export function CategoriesTable({ initialCategories }: CategoriesTableProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [filteredCategories, setFilteredCategories] = useState(initialCategories)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Search functionality
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(term.toLowerCase()) ||
      category.slug.toLowerCase().includes(term.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(term.toLowerCase()))
    )
    setFilteredCategories(filtered)
  }

  // Refresh data
  const refreshData = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setCategories(result.data)
          setFilteredCategories(result.data)
        }
      }
    } catch (error) {
      console.error('Error refreshing data:', error)
    }
  }

  // Delete category
  const handleDelete = async () => {
    if (!categoryToDelete) return
    
    setIsDeleting(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/categories/${categoryToDelete.id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        setSuccess('Category deleted successfully')
        await refreshData()
        setShowDeleteModal(false)
        setCategoryToDelete(null)
        
        // Clear success message
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(result.error || 'Failed to delete category')
      }
    } catch (error) {
      setError('Network error. Please try again.')
      console.error('Error deleting category:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  // Edit category
  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setShowForm(true)
  }

  // Create new category
  const handleCreate = () => {
    setSelectedCategory(null)
    setShowForm(true)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
        <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-4">
          <FunnelIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No categories found</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
          Get started by creating your first category to organize your blog posts.
        </p>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create First Category
        </button>

        <CategoryForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSuccess={refreshData}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <CheckIcon className="h-5 w-5 text-green-400 mr-3" />
          <span className="text-sm text-green-700 dark:text-green-400">{success}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-3" />
          <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
        </div>
      )}

      {/* Header with Search and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Category
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Posts
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th className="relative px-6 py-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div
                        className="h-4 w-4 rounded-full mr-3 ring-2 ring-white dark:ring-gray-800"
                        style={{ backgroundColor: category.color || '#6366f1' }}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {category.name}
                        </div>
                        {category.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                            {category.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {category.image ? (
                      <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <Image
                          src={category.image}
                          alt={category.name}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-xs text-gray-400">No image</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-900 dark:text-white">
                      {category.slug}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                      {category.posts.length} {category.posts.length === 1 ? 'post' : 'posts'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(category.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-1.5 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        title="Edit category"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setCategoryToDelete(category)
                          setShowDeleteModal(true)
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Delete category"
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

        {filteredCategories.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No categories found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              No categories match your search for &ldquo;{searchTerm}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Category Form Modal */}
      <CategoryForm
        category={selectedCategory || undefined}
        isOpen={showForm}
        onClose={() => {
          setShowForm(false)
          setSelectedCategory(null)
        }}
        onSuccess={() => {
          refreshData()
          setShowForm(false)
          setSelectedCategory(null)
        }}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && categoryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Delete Category
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Are you sure you want to delete &ldquo;{categoryToDelete.name}&rdquo;? 
                  {categoryToDelete.posts.length > 0 && (
                    <span className="block mt-2 text-red-600 dark:text-red-400 font-medium">
                      This category has {categoryToDelete.posts.length} posts and cannot be deleted.
                    </span>
                  )}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setCategoryToDelete(null)
                    setError('')
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting || categoryToDelete.posts.length > 0}
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

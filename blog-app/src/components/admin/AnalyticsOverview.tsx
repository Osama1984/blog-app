'use client'

import { useState, useEffect } from 'react'
import { 
  DocumentTextIcon,
  UserGroupIcon,
  FolderOpenIcon,
  TagIcon,
  ChatBubbleLeftIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  UserIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface AnalyticsData {
  overview: {
    totalPosts: number
    publishedPosts: number
    draftPosts: number
    totalUsers: number
    totalCategories: number
    totalTags: number
    totalComments: number
    growth: {
      comments: number
      posts: number
      users: number
    }
  }
  recentPosts: Array<{
    id: string
    title: string
    slug: string
    status: string
    createdAt: string
    author: { name: string; email: string }
    commentsCount: number
    likesCount: number
    categories: Array<{ category: { name: string; color: string } }>
  }>
  recentComments: Array<{
    id: string
    content: string
    createdAt: string
    author: { name: string; email: string; image?: string }
    post: { title: string; slug: string }
  }>
  topCategories: Array<{
    id: string
    name: string
    slug: string
    color: string
    postsCount: number
  }>
  topTags: Array<{
    id: string
    name: string
    slug: string
    postsCount: number
  }>
  userStats: Array<{
    role: string
    _count: { id: number }
  }>
  postStats: Array<{
    status: string
    _count: { id: number }
  }>
  period: number
}

const StatCard = ({ 
  title, 
  value, 
  icon, 
  growth, 
  description 
}: { 
  title: string
  value: number
  icon: React.ReactNode
  growth?: number
  description?: string
}) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
        {growth !== undefined && (
          <div className="flex items-center mt-1">
            {growth >= 0 ? (
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm ${growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(growth)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">from last period</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <div className="text-gray-400">
        {icon}
      </div>
    </div>
  </div>
)

export default function AnalyticsOverview() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState('30')

  const fetchAnalytics = async (selectedPeriod: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/admin/analytics?period=${selectedPeriod}`)
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch analytics')
      }
      
      setData(result.data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics(period)
  }, [period])

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error loading analytics: {error}</p>
            <button 
              onClick={() => fetchAnalytics(period)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of your blog performance for the last {data.period} days
          </p>
        </div>
        <select 
          value={period} 
          onChange={(e) => handlePeriodChange(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
        >
          <option value="7">7 days</option>
          <option value="30">30 days</option>
          <option value="90">90 days</option>
          <option value="365">1 year</option>
        </select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Posts"
          value={data.overview.totalPosts}
          icon={<DocumentTextIcon className="h-8 w-8" />}
          growth={data.overview.growth.posts}
          description={`${data.overview.publishedPosts} published, ${data.overview.draftPosts} drafts`}
        />
        <StatCard
          title="Total Users"
          value={data.overview.totalUsers}
          icon={<UserGroupIcon className="h-8 w-8" />}
          growth={data.overview.growth.users}
        />
        <StatCard
          title="Categories"
          value={data.overview.totalCategories}
          icon={<FolderOpenIcon className="h-8 w-8" />}
        />
        <StatCard
          title="Tags"
          value={data.overview.totalTags}
          icon={<TagIcon className="h-8 w-8" />}
        />
        <StatCard
          title="Comments"
          value={data.overview.totalComments}
          icon={<ChatBubbleLeftIcon className="h-8 w-8" />}
          growth={data.overview.growth.comments}
          description={`In the last ${data.period} days`}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <DocumentTextIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Posts</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Latest published posts in the last {data.period} days
          </p>
          <div className="space-y-4">
            {data.recentPosts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No posts found in the selected period
              </p>
            ) : (
              data.recentPosts.slice(0, 5).map((post) => (
                <div key={post.id} className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">{post.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <UserIcon className="h-3 w-3" />
                          {post.author.name}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <ClockIcon className="h-3 w-3" />
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                      {post.categories.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {post.categories.slice(0, 2).map((cat, index) => (
                            <span 
                              key={index} 
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                              style={{ 
                                backgroundColor: cat.category.color + '20', 
                                color: cat.category.color 
                              }}
                            >
                              {cat.category.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <ChatBubbleLeftIcon className="h-3 w-3" />
                        {post.commentsCount}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <EyeIcon className="h-3 w-3" />
                        {post.likesCount}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Comments */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <ChatBubbleLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Comments</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Latest comments in the last {data.period} days
          </p>
          <div className="space-y-4">
            {data.recentComments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No comments found in the selected period
              </p>
            ) : (
              data.recentComments.slice(0, 5).map((comment) => (
                <div key={comment.id} className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white line-clamp-2">{comment.content}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <UserIcon className="h-3 w-3" />
                          {comment.author.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          on {comment.post.title}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <ClockIcon className="h-3 w-3" />
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <FolderOpenIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Categories</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Most used categories in the last {data.period} days
          </p>
          <div className="space-y-3">
            {data.topCategories.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No categories found
              </p>
            ) : (
              data.topCategories.map((category) => (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium text-sm text-gray-900 dark:text-white">{category.name}</span>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    {category.postsCount} posts
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Tags */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <TagIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Tags</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Most used tags in the last {data.period} days
          </p>
          <div className="space-y-3">
            {data.topTags.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No tags found
              </p>
            ) : (
              data.topTags.map((tag) => (
                <div key={tag.id} className="flex items-center justify-between">
                  <span className="font-medium text-sm text-gray-900 dark:text-white">#{tag.name}</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    {tag.postsCount} posts
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

import PostsTable from '@/components/admin/PostsTable'

export default function PostsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
          <p className="text-gray-600 mt-1">
            Manage your blog posts
          </p>
        </div>
      </div>

      <PostsTable />
    </div>
  )
}

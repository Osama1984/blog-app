import TagsTable from '@/components/admin/TagsTable'

export default function TagsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
          <p className="text-gray-600 mt-1">
            Manage your blog tags
          </p>
        </div>
      </div>

      <TagsTable />
    </div>
  )
}

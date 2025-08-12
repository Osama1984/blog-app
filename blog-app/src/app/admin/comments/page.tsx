import { Suspense } from 'react'
import { CommentsTable } from '@/components/admin/CommentsTable'

export default function CommentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Comments</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage and moderate user comments
          </p>
        </div>
      </div>

      <Suspense fallback={<div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>}>
        <CommentsTable />
      </Suspense>
    </div>
  )
}

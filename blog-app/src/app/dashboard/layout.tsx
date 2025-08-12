import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <DashboardSidebar />
          <div className="flex-1 lg:ml-64">
            <DashboardHeader />
            <main className="p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </SessionProvider>
  )
}

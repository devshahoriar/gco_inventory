import AdminPanelLayout from '@/components/admin-panel/admin-panel-layout'
import { getUser } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'
import { getOrgById } from './action'

const layout = async ({ children }: { children: ReactNode }) => {
  const user = await getUser(headers)
  if (!user) {
    redirect('/join')
  }
  const org = await getOrgById(user?.activeOrganizationId)
  return <AdminPanelLayout orgName={org?.name}>{children}</AdminPanelLayout>
}

export default layout

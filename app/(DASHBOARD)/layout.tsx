import AdminPanelLayout from '@/components/admin-panel/admin-panel-layout'
import { getUser } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'
import { getOrgById } from './action'
import { Button } from '@/components/ui/button'

import Link from 'next/link'
import { Home } from 'lucide-react'

const layout = async ({ children }: { children: ReactNode }) => {
  const user = await getUser(headers)
  if (!user) {
    redirect('/join')
  }
  if (!user?.activeOrganizationId) {
    return (
      <div className="h-screen w-screen flex items-center justify-center flex-col">
        <h1 className="text-3xl text-center">
          First Join or Create Organization.
        </h1>
        <Button variant="outline" asChild className='mt-2'>
          <Link href="/">
            Home <Home />
          </Link>
        </Button>
      </div>
    )
  }
  const org = await getOrgById(user?.activeOrganizationId)
  return <AdminPanelLayout orgName={org?.name}>{children}</AdminPanelLayout>
}

export default layout

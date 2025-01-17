import { ContentLayout } from '@/components/admin-panel/content-layout'
import { PageLeftComponent, PageTopBar } from '@/components/shared/PageElement'
import React from 'react'
import { countReq, getAllReq } from './action'
import { getUser } from '@/lib/auth'
import { headers } from 'next/headers'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'

const RequisitionPage = async () => {
  const user = await getUser(headers)
  const count = await countReq(user?.activeOrganizationId as string)
  const getAllreqs = await getAllReq(user?.activeOrganizationId as string)
  console.log(getAllreqs)
  return (
    <ContentLayout title="Requisition">
      <PageTopBar>
        <PageLeftComponent title="Requisition" length={count} />
        <Button variant="outline" asChild>
          <Link href="/purchase/requisition/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Requisition
          </Link>
        </Button>
      </PageTopBar>
    </ContentLayout>
  )
}

export default RequisitionPage

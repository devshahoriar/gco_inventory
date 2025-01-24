import { ContentLayout } from '@/components/admin-panel/content-layout'
import { getActiveOrg } from '@/lib/auth'
import React from 'react'
import { challan } from './action'
import { PageLeftComponent, PageTopBar } from '@/components/shared/PageElement'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'

const ChallanPage =async () => {
  const orgId = await getActiveOrg()
  const c= new challan(orgId)
  const data = await c.getChallan()
  
  return (
    <ContentLayout title="Challan">
      <PageTopBar>
        <PageLeftComponent title="Requisition" length={data?.length} />
        <Button variant="outline" asChild>
          <Link href="/purchase/challan/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Requisition
          </Link>
        </Button>
      </PageTopBar>
    </ContentLayout>
  )
}

export default ChallanPage
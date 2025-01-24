import { ContentLayout } from '@/components/admin-panel/content-layout'
import { PageLeftComponent, PageTopBar } from '@/components/shared/PageElement'
import { Button } from '@/components/ui/button'
import { getActiveOrg } from '@/lib/auth'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { Challan } from './action'

const ChallanPage = async () => {
  const orgId = await getActiveOrg()
  const ch = new Challan(orgId)
  const data = await ch.getAllChallan()
 
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

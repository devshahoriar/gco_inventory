import { PageLeftComponent, PageTopBar } from '@/components/shared/PageElement'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { getAllSalesReturnCountInOrg } from './action'

const Count = async ({ activeOrg }: { activeOrg: string }) => {
  const count = await getAllSalesReturnCountInOrg(activeOrg)
  return (
    <PageTopBar>
      <PageLeftComponent title="Sales Return" length={count} />
      <Button variant="outline" asChild>
        <Link href="/sales/return/add">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Return Order
        </Link>
      </Button>
    </PageTopBar>
  )
}

export default Count

import { PageLeftComponent, PageTopBar } from '@/components/shared/PageElement'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { getAllReturnCountInOrg } from './action'

const Count = async ({ activeOrg }: { activeOrg: string }) => {
  const count = await getAllReturnCountInOrg(activeOrg)
  return (
    <PageTopBar>
      <PageLeftComponent title="Return" length={count} />
      <Button variant="outline" asChild>
        <Link href="/purchase/return/add">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Return
        </Link>
      </Button>
    </PageTopBar>
  )
}

export default Count

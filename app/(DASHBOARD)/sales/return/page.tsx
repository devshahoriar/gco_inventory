import { ContentLayout } from '@/components/admin-panel/content-layout'
import { PageLeftComponent, PageTopBar } from '@/components/shared/PageElement'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const SealsReturnPage = () => {
  return (
    <ContentLayout title='Seals Return'>
       <PageTopBar>
        <PageLeftComponent title="Sales Orders" length={0} />
        <Button variant="outline" asChild>
          <Link href="/sales/return/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Return Order
          </Link>
        </Button>
      </PageTopBar>
    </ContentLayout>
  )
}

export default SealsReturnPage
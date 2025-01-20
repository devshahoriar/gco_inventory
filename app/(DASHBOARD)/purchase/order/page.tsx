import { ContentLayout } from '@/components/admin-panel/content-layout'
import React from 'react'
import { getAllOrder } from './action'
import { PageLeftComponent, PageTopBar } from '@/components/shared/PageElement'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'

const OrderPage =async () => {
  const allOrder = await getAllOrder()
  return <ContentLayout title="Order">
    <PageTopBar>
        <PageLeftComponent title="Orders" length={allOrder.length} />
        <Button variant="outline" asChild>
          <Link href="/purchase/order/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Order
          </Link>
        </Button>
      </PageTopBar>
  </ContentLayout>
}

export default OrderPage

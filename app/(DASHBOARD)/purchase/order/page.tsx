import { ContentLayout } from '@/components/admin-panel/content-layout'
import React from 'react'
import { getAllOrder } from './action'
import { PageLeftComponent, PageTopBar } from '@/components/shared/PageElement'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { getActiveOrg } from '@/lib/auth'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const OrderPage = async () => {
  const orgId = await getActiveOrg()
  const allOrder = await getAllOrder(orgId)
  
  return (
    <ContentLayout title="Order">
      <PageTopBar>
        <PageLeftComponent title="Orders" length={allOrder.length} />
        <Button variant="outline" asChild>
          <Link href="/purchase/order/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Order
          </Link>
        </Button>
      </PageTopBar>
      
      {allOrder.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[400px] border rounded-lg bg-muted/10">
          <p className="text-2xl font-semibold text-muted-foreground mb-2">No Orders Found</p>
          <p className="text-muted-foreground mb-4">Create your first order by clicking the Add Order button above.</p>
          <Button asChild>
            <Link href="/purchase/order/add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Order
            </Link>
          </Button>
        </div>
      ) : (
        <div className="">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order No</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Total Products</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Shipping Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allOrder.map((order) => {
                const totalProducts = order.OrderItems.length
                const totalPrice = order.OrderItems.reduce(
                  (sum, item) => sum + (item.price * item.quantity),
                  0
                )

                return (
                  <TableRow key={order.id}>
                    <TableCell>{order.orderNo}</TableCell>
                    <TableCell>{format(new Date(order.orderDate), 'PP')}</TableCell>
                    <TableCell>{format(new Date(order.dueDate), 'PP')}</TableCell>
                    <TableCell>{totalProducts}</TableCell>
                    <TableCell>${totalPrice.toFixed(2)}</TableCell>
                    <TableCell>{order.Warehouse?.name || 'N/A'}</TableCell>
                    <TableCell>{order.Branch?.name || 'N/A'}</TableCell>
                    <TableCell>{order.supingAddress}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </ContentLayout>
  )
}

export default OrderPage

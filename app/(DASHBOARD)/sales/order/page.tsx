import { ContentLayout } from '@/components/admin-panel/content-layout'
import { PageLeftComponent, PageTopBar } from '@/components/shared/PageElement'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getActiveOrg } from '@/lib/auth'
import { format } from 'date-fns'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { getAllSalesOrders } from './action'

async function OrderPage() {
  const orgId = await getActiveOrg()
  const allOrders = await getAllSalesOrders(orgId)

  return (
    <ContentLayout title="Sales Orders">
      <PageTopBar>
        <PageLeftComponent title="Sales Orders" length={allOrders.length} />
        <Button variant="outline" asChild>
          <Link href="/sales/order/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Sales Order
          </Link>
        </Button>
      </PageTopBar>

      {allOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[400px] border rounded-lg bg-muted/10">
          <p className="text-2xl font-semibold text-muted-foreground mb-2">
            No Sales Orders Found
          </p>
          <p className="text-muted-foreground mb-4">
            Create your first sales order by clicking the Add Sales Order button
            above.
          </p>
          <Button asChild>
            <Link href="/sales/order/add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Sales Order
            </Link>
          </Button>
        </div>
      ) : (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order No</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allOrders.map((order) => {
                const totalAmount = order.SealsProduct.reduce(
                  (sum, item) => sum + item.rate * item.quantity,
                  0
                )

                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {order.orderNo}
                        {order.SealsChallan && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            Challaned
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.orderDate), 'PP')}
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.deliveryDate), 'PP')}
                    </TableCell>
                    <TableCell>{order.Customers.name}</TableCell>
                    <TableCell>{order.SealsProduct.length}</TableCell>
                    <TableCell>${totalAmount.toFixed(2)}</TableCell>
                    <TableCell>{order.Branch?.name || 'N/A'}</TableCell>
                    <TableCell>{order.Warehouse.name}</TableCell>
                    <TableCell>
                      {!order.SealsChallan && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/sales/order/edit/${order.id}`}>
                            Edit
                          </Link>
                        </Button>
                      )}
                    </TableCell>
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

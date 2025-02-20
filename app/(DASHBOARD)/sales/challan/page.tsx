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
import { getAllSalesChallan } from './action'

async function SealsChallanPage() {
  const orgId = await getActiveOrg()
  const allChallans = await getAllSalesChallan(orgId)

  return (
    <ContentLayout title="Sales Challan">
      <PageTopBar>
        <PageLeftComponent title="Sales Challan" length={allChallans.length} />
        <Button variant="outline" asChild>
          <Link href="/sales/challan/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Sales Challan
          </Link>
        </Button>
      </PageTopBar>

      {allChallans.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[400px] border rounded-lg bg-muted/10">
          <p className="text-2xl font-semibold text-muted-foreground mb-2">
            No Sales Challans Found
          </p>
          <p className="text-muted-foreground mb-4">
            Create your first sales challan by clicking the Add Sales Challan button above.
          </p>
          <Button asChild>
            <Link href="/sales/challan/add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Sales Challan
            </Link>
          </Button>
        </div>
      ) : (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Challan No</TableHead>
                <TableHead>Challan Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Sales Order</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allChallans.map((challan) => (
                <TableRow key={challan.id}>
                  <TableCell>{challan.salessChallanNo}</TableCell>
                  <TableCell>
                    {format(new Date(challan.clallanDate), 'PP')}
                  </TableCell>
                  <TableCell>
                    {format(new Date(challan.dueDate), 'PP')}
                  </TableCell>
                  <TableCell>{challan.Customers.name}</TableCell>
                  <TableCell>{challan.SealsOrder.orderNo}</TableCell>
                  <TableCell>{challan.sealsChallanItems.length}</TableCell>
                  <TableCell>{challan.Branch.name}</TableCell>
                  <TableCell>{challan.Warehouse.name}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/sales/challan/${challan.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </ContentLayout>
  )
}

export default SealsChallanPage

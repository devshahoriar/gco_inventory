/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { getAllReturnByOrg } from './action'

const ReturnPage = async () => {
  const activeOrg = await getActiveOrg()
  const allReturns = await getAllReturnByOrg(activeOrg)

  // Calculate total amount for each return
  const calculateTotal = (items: any[]) => {
    return items.reduce((sum, item) => {
      return sum + (item.quantity * item.rate)
    }, 0)
  }

  return (
    <ContentLayout title="Return">
      <PageTopBar>
        <PageLeftComponent title="Returns" length={allReturns?.length} />
        <Button variant="outline" asChild>
          <Link href="/purchase/return/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Return
          </Link>
        </Button>
      </PageTopBar>

      <div className="mt-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Return No</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allReturns?.map((returnItem) => (
              <TableRow key={returnItem.id}>
                <TableCell>{returnItem.returnNo}</TableCell>
                <TableCell>
                  {format(returnItem.returnDate, 'dd-MM-yyyy')}
                </TableCell>
                <TableCell>{returnItem.Supplier?.name || 'N/A'}</TableCell>
                <TableCell>{returnItem.Warehouse?.name || 'N/A'}</TableCell>
                <TableCell className="text-right">
                  ৳{calculateTotal(returnItem.ReturnItems).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ContentLayout>
  )
}

export default ReturnPage

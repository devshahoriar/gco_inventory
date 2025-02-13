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
import { getAllOpningBalanceForOrg } from './action'

const OpningBalance = async () => {
  const activOrg = await getActiveOrg()
  const allOpningBalances = await getAllOpningBalanceForOrg(activOrg)

  return (
    <ContentLayout title="Opening Balance">
      <PageTopBar>
        <PageLeftComponent title="Opening Balance" length={allOpningBalances?.length} />
        <Button variant="outline" asChild>
          <Link href="/inventory/opningbalance/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Opening Balance
          </Link>
        </Button>
      </PageTopBar>

      <div className="mt-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allOpningBalances?.map((balance) => (
              <TableRow key={balance.id}>
                <TableCell>{balance.product?.name}</TableCell>
                <TableCell>{balance.warehouse?.name}</TableCell>
                <TableCell>{balance.quantity}</TableCell>
                <TableCell>৳{balance.rate}</TableCell>
                <TableCell>{format(balance.openData, 'dd-MM-yyyy')}</TableCell>
                <TableCell className="text-right">
                  ৳{(balance.quantity * balance.rate).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ContentLayout>
  )
}

export default OpningBalance

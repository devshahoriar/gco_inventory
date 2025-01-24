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
} from "@/components/ui/table"
import { getActiveOrg } from '@/lib/auth'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { getAllChallan } from './action'

const ChallanPage = async () => {
  const orgId = await getActiveOrg()
  const data = await getAllChallan(orgId)

  // Calculate total amount for each challan
  const calculateTotal = (items: any[]) => {
    return items.reduce((sum, item) => sum + (item.quantity * item.rate), 0)
  }

  return (
    <ContentLayout title="Challan">
      <PageTopBar>
        <PageLeftComponent title="Challan" length={data?.length} />
        <Button variant="outline" asChild>
          <Link href="/purchase/challan/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Challan
          </Link>
        </Button>
      </PageTopBar>

      <div className="mt-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Challan No</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Shipping Address</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((challan) => (
              <TableRow key={challan.id}>
                <TableCell>{challan.challanNo}</TableCell>
                <TableCell>{new Date(challan.challanDate).toLocaleDateString()}</TableCell>
                <TableCell>{challan.Supplier?.name || 'N/A'}</TableCell>
                <TableCell>{challan.supingAddress}</TableCell>
                <TableCell className="text-right">
                  ৳{calculateTotal(challan.ChallanItems).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ContentLayout>
  )
}

export default ChallanPage

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
import { countReq, getAllReq } from './action'

const RequisitionPage = async () => {
  const orgId = await getActiveOrg()
  const count = await countReq(orgId)
  const getAllreqs = await getAllReq(orgId)

  return (
    <ContentLayout title="Requisition">
      <PageTopBar>
        <PageLeftComponent title="Requisition" length={count} />
        <Button variant="outline" asChild>
          <Link href="/purchase/requisition/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Requisition
          </Link>
        </Button>
      </PageTopBar>

      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reg Number</TableHead>
              <TableHead>Add By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Narration</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getAllreqs.map((req) => (
              <TableRow key={req.id}>
                <TableCell>
                  {req.regNumber}
                  {req?.isOrdered && (
                    <span className="ml-3 bg-green-500 bg-opacity-50 text-xs px-2 py-1 rounded-sm">
                      Ordered
                    </span>
                  )}
                </TableCell>
                <TableCell className="capitalize">
                  {req?.creator?.name}
                </TableCell>
                <TableCell>
                  {format(new Date(req.reqDate), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  {req.reqItems.map((item) => (
                    <div key={item.id}>
                      {item.quantity} x {item.product.name} ({item.group.name})
                    </div>
                  ))}
                </TableCell>
                <TableCell>{req.naration}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/purchase/requisition/edit/${req.id}`}>
                      Edit
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ContentLayout>
  )
}

export default RequisitionPage

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
              <TableHead>Opening Date</TableHead>
              <TableHead>Items Count</TableHead>
              <TableHead>Remark</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allOpningBalances?.map((balance) => (
              <TableRow key={balance.id}>
                <TableCell>{format(balance.openDate, 'dd-MM-yyyy')}</TableCell>
                <TableCell>{balance.OpningBalancesItem.length}</TableCell>
                <TableCell>{balance.remark || '-'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/inventory/opningbalance/${balance.id}`}>
                      View Details
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

export default OpningBalance

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { PageTopBar } from '@/components/shared/PageElement'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import EditCustomer from './EditCustomer'
import NewCustomer from './NewCustomer'
import { allCustomers } from './action'

const CustomerPage = async () => {
  const allCustomer = await allCustomers()
  return (
    <ContentLayout title="Customer">
      <PageTopBar>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Warehouses</h2>
          <span className="rounded-md bg-muted px-2 py-1 text-xs">
            {allCustomer.length} total
          </span>
        </div>
        <NewCustomer />
      </PageTopBar>

      <div className="rounded-md border mt-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allCustomer.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.mobile}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell className="text-right">
                  <EditCustomer customer={customer} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ContentLayout>
  )
}

export default CustomerPage

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { PageLeftComponent, PageTopBar } from '@/components/shared/PageElement'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getActiveOrg } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { countSupplier, getAllSupplier } from './action'
import AddNewSupplier from './AddNewSuplayer'
import DeleteSupplier from './DeleteSupplier'
import EditSupplier from './EditSupplier'

const SupplierPage = async () => {
  const orgId = await getActiveOrg()
  const countSuppliers = await countSupplier(orgId)
  const allSuppliers = await getAllSupplier(orgId)

  return (
    <ContentLayout title="Supplier">
      <PageTopBar>
        <PageLeftComponent title="Supplier" length={countSuppliers} />
        <AddNewSupplier orgId={orgId} />
      </PageTopBar>

      <Card className="mt-4">
        <CardContent className="p-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allSuppliers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No data found
                  </TableCell>
                </TableRow>
              )}
              {allSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.code}</TableCell>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>
                    {supplier.phone}
                    <br />
                    {supplier.email}
                  </TableCell>
                  <TableCell>{supplier.address}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        supplier.status ? 'text-green-500' : 'text-red-500'
                      )}
                    >
                      {supplier.status ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>{supplier.note}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <EditSupplier supplier={supplier} />
                      <DeleteSupplier id={supplier.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </ContentLayout>
  )
}

export default SupplierPage

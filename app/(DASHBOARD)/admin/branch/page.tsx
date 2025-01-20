import { ContentLayout } from '@/components/admin-panel/content-layout'
import { PageLeftComponent, PageTopBar } from '@/components/shared/PageElement'
import { Button } from '@/components/ui/button'
import { getAllBranch } from './action'
import { AddBranch } from './AddBrance'
import { EditBranch } from './EditBranch'
import { DeleteBranch } from './DeleteBranch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"

const BranchPage = async () => {
  const allBrance = await getAllBranch()
  return (
    <ContentLayout title="Branch">
      <PageTopBar>
        <PageLeftComponent title="Branchs" length={allBrance?.length} />
        <Button variant="outline" asChild>
          <AddBranch />
        </Button>
      </PageTopBar>
      <div className='mt-4'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allBrance?.map((branch) => (
              <TableRow key={branch.id}>
                <TableCell className="font-medium">{branch.name}</TableCell>
                <TableCell>{branch.description || '-'}</TableCell>
                <TableCell>{branch.address}</TableCell>
                <TableCell>{format(new Date(branch.createdAt), 'PPP')}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <EditBranch branch={branch} />
                    <DeleteBranch id={branch.id} name={branch.name} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ContentLayout>
  )
}

export default BranchPage

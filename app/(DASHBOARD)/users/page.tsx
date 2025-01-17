import { ContentLayout } from '@/components/admin-panel/content-layout'
import { PageTopBar } from '@/components/shared/PageElement'
import { getUser, UserType } from '@/lib/auth'
import { headers } from 'next/headers'
import { getAllMembersByOrgId } from './action'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import EditUser from './EditUser'

const ALL_PERMISSIONS = ["all"]

const ManageUserPage = async () => {
  const user = (await getUser(headers)) as UserType
  const getAllMembers = await getAllMembersByOrgId(
    user.activeOrganizationId as string
  )
  console.log(getAllMembers)

  return (
    <ContentLayout title="Users">
      <PageTopBar>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Manage Users</h2>
          <span className="rounded-md bg-muted px-2 py-1 text-xs">
            {getAllMembers.length} total
          </span>
        </div>
      </PageTopBar>
      <div className="mt-4">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getAllMembers.map((member) => (
                  <TableRow key={member.user.id}>
                    <TableCell className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.user.image || ''} />
                        <AvatarFallback>
                          {member.user.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.user.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{member.role}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(member.role === 'owner' 
                          ? ALL_PERMISSIONS 
                          : member.permissions?.split(',') || []
                        ).map((permission) => (
                          <Badge 
                            key={permission}
                            variant="secondary"
                            className="capitalize"
                          >
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          member.ban
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {member.ban ? 'Banned' : 'Active'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(member.createdAt), 'PPP')}
                    </TableCell>
                    <TableCell>
                      <EditUser/>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  )
}

export default ManageUserPage

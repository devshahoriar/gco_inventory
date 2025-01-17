'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EditGroup } from './client'
import { Card } from '@/components/ui/card'

interface GroupTableProps {
  groups: {
    id: string
    name: string
    group: string
    description: string | null
  }[]
}

export const GroupTable = ({ groups }: GroupTableProps) => {
  return (
    <Card className="mt-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Group Code</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[50px]">Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No data found
              </TableCell>
            </TableRow>
          )}
          {groups.map((group) => (
            <TableRow key={group.id}>
              <TableCell>{group.name}</TableCell>
              <TableCell>{group.group}</TableCell>
              <TableCell>{group.description}</TableCell>
              <TableCell>
                <EditGroup group={group} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

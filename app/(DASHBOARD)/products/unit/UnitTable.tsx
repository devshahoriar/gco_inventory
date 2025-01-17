'use client'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EditUnit } from './client'

interface Unit {
  id: string
  name: string
  unit: string
  description: string | null
}

interface UnitTableProps {
  units: Unit[]
}

export function UnitTable({ units }: UnitTableProps) {
  return (
    <Card className="mt-4">
      <CardContent className="p-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {units.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No data found
              </TableCell>
            </TableRow>
          )}
          {units.map((unit) => (
            <TableRow key={unit.id}>
              <TableCell>{unit.name}</TableCell>
              <TableCell>{unit.unit}</TableCell>
              <TableCell>{unit.description || '-'}</TableCell>
              <TableCell>
                <EditUnit unit={unit} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table></CardContent>
    </Card>
  )
}

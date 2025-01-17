'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Package } from 'lucide-react'
import { EditWarehouse } from './edit-warehouse'

interface WarehouseTableProps {
  warehouses: {
    id: string
    name: string
    address: string
    description: string | null
    _count: {
      Purchase: number
    }
  }[]
}

export function WarehouseTable({ warehouses }: WarehouseTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Warehouse</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {warehouses.map((warehouse) => (
              <TableRow key={warehouse.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    {warehouse.name}
                  </div>
                </TableCell>
                <TableCell>{warehouse.address}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    <Package className="mr-1 h-3 w-3" />
                    {warehouse._count.Purchase} items
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {warehouse.description || 'No description'}
                </TableCell>
                <TableCell>
                  <EditWarehouse warehouse={warehouse} />
                </TableCell>
              </TableRow>
            ))}
            {warehouses.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No warehouses found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

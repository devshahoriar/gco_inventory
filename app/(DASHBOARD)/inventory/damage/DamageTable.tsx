'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'

interface DamageRecord {
  id: string
  damageNo: string
  damageDate: Date
  quantity: number
  price: number
  remark?: string | null
  product: {
    name: string
    productUnit?: {
      unit: string
    } | null
  }
  Warehouse: {
    name: string
  }
}

interface DamageTableProps {
  data: DamageRecord[]
}

export function DamageTable({ data }: DamageTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Damage No</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Warehouse</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Total Value</TableHead>
            <TableHead>Remark</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.damageNo}</TableCell>
                <TableCell>{format(new Date(record.damageDate), 'MMM dd, yyyy')}</TableCell>
                <TableCell>{record.product.name}</TableCell>
                <TableCell>{record.Warehouse.name}</TableCell>
                <TableCell>
                  {record.quantity} {record.product.productUnit?.unit || ''}
                </TableCell>
                <TableCell>৳{record.price.toFixed(2)}</TableCell>
                <TableCell>৳{(record.price * record.quantity).toFixed(2)}</TableCell>
                <TableCell>{record.remark || '-'}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No damage records found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

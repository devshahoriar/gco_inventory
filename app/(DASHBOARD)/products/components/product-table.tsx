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
import { EditProduct } from './edit-product'

interface ProductTableProps {
  products: {
    id: string
    name: string
    description?: string | null
    productUnitId: string
    productGroupId: string
    productUnit: {
      name: string
    }
    ProductGroup: {
      name: string
    }
  }[]
}

export function ProductTable({ products }: ProductTableProps) {

  
  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="flex h-[150px] items-center justify-center text-muted-foreground">
          No products found
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.ProductGroup.name}</TableCell>
                <TableCell>{product.productUnit.name}</TableCell>
                <TableCell>
                  <EditProduct product={product} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

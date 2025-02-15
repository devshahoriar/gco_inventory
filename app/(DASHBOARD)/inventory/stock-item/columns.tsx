"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

// Update type to exactly match prisma return type
type StockItem = {
  id: string
  description: string
  rate: number
  product: {
    id: string
    name: string
    productUnit: {
      name: string
    }
  }
  warehouse: {
    name: string
  }
  batch: string
  discount: number
  invoice: {
    invoiceNo: string
  }
}

export const columns: ColumnDef<StockItem>[] = [
  {
    accessorFn: (row) => row.product.name,
    header: "Product Name",
  },
  {
    accessorFn: (row) => row.product.productUnit.name,
    header: "Unit",
  },
  {
    accessorKey: "rate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rate
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    sortingFn: "basic",
    enableSorting: true,
  },
  {
    id: "branch",
    accessorFn: (row) => row.warehouse.name, 
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Branch
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    sortingFn: "basic",
    enableSorting: true,
  },
  {
    id: "warehouse",
    accessorFn: (row) => row.warehouse.name,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Warehouse
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    sortingFn: "basic",
    enableSorting: true,
  },
  {
    id: "invoice",
    accessorFn: (row) => row.invoice.invoiceNo,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Invoice No
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    sortingFn: "basic",
    enableSorting: true,
  },
]

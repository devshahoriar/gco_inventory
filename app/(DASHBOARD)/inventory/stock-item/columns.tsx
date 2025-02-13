"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

type StockItem = {
  id: string
  batch: string
  invoice: { invoiceNo: string }
  branch: { name: string }
  description: string
  discount: number
  rate: number
  warehouse: { name: string }
  product: {
    name: string
    id: string
    productUnit: { name: string }
  }
}

export const columns: ColumnDef<StockItem>[] = [
  {
    accessorKey: "product.name",
    header: "Product Name",
  },
  {
    accessorKey: "product.productUnit.name",
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
    accessorFn: row => row.branch.name,
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
    accessorFn: row => row.warehouse.name,
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
    accessorFn: row => row.invoice.invoiceNo,
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

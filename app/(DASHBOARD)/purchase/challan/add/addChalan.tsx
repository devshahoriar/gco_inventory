'use client'

import { AsyncSelect } from '@/components/ui/async-select'
import { Button } from '@/components/ui/button'
import DateInput from '@/components/ui/DateInput'
import { Input, InputParent } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PlusCircle, X } from 'lucide-react'
import { useState } from 'react'

const ChallanItemInput = ({
  index,
  removeItem,
}: {
  index: number
  removeItem: (index: number) => void
}) => {
  return (
    <TableRow>
      <TableCell>
        <AsyncSelect
          placeholder="Select Product"
          fetcher={() => Promise.resolve([])}
        />
      </TableCell>
      <TableCell>
        <InputParent type="number" placeholder="Quantity" />
      </TableCell>
      <TableCell>
        <InputParent type="number" placeholder="Rate" />
      </TableCell>
      <TableCell>
        <InputParent placeholder="Batch No" />
      </TableCell>
      <TableCell>
        <InputParent placeholder="Description" />
      </TableCell>
      <TableCell>
        <Button variant="ghost" size="sm" onClick={() => removeItem(index)}>
          <X className="size-4" />
        </Button>
      </TableCell>
    </TableRow>
  )
}

const AddChalan = () => {
  const [itemCount, setItemCount] = useState(0)

  const addItem = () => {
    setItemCount((prev) => prev + 1)
  }

  const removeItem = (index: number) => {
    setItemCount((prev) => prev - 1)
  }

  return (
    <div className="max-w-4xl mx-auto p-2">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label>Order</Label>
            <AsyncSelect
              label="Order"
              placeholder="Select Order"
              fetcher={() => Promise.resolve([])}
            />
          </div>
          <InputParent
            labelTitle="Challan Number"
            placeholder="Enter challan number"
          />

          <div className="space-y-2">
            <Label>Challan Date</Label>
            <DateInput
              className="w-full block"
              value={new Date()}
              onChange={() => {}}
            />
          </div>
          <div className="space-y-2">
            <Label>Challan Due Date</Label>
            <DateInput
              className="w-full block"
              value={new Date()}
              onChange={() => {}}
            />
          </div>
          <InputParent labelTitle="Order Date" placeholder="Date" />
          <InputParent labelTitle="Deu Order Date" placeholder="Date" />



          <InputParent labelTitle="Branch" placeholder="Branch" />
          <InputParent labelTitle="Warehouse" placeholder="Warehouse" />
          <InputParent labelTitle="Supplier" placeholder="Supplier" />
        </div>
        <InputParent
          labelTitle="Shipping Address"
          placeholder="Enter shipping address"
        />
        <InputParent
          labelTitle="Remarks"
          isTextArea
          placeholder="Add notes or remarks..."
        />

        {itemCount > 0 && (
          <div className="space-y-3">
            <Label className="flex gap-2 items-center justify-center border-b pb-2 text-xl">
              Challan Items
            </Label>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(itemCount)].map((_, i) => (
                    <ChallanItemInput
                      key={i}
                      index={i}
                      removeItem={removeItem}
                    />
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={6}>Total Items: {itemCount}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          className="!bg-transparent"
          onClick={addItem}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Item
        </Button>

        <Button className="w-full">Submit Challan</Button>
      </div>
    </div>
  )
}

export default AddChalan

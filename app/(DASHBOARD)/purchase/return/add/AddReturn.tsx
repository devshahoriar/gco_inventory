/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useState } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'
import { createReturn, getInvoicesForSelect, getReturnNumber } from './action'

interface ReturnItem {
  productId: string
  productName: string
  quantity: number
  rate: number
  batch: string
  description: string
}

interface ReturnForm {
  returnNo: string
  returnDate: string
  returnDueDate: string
  invoiceId: string
  branceId: string
  branceName: string
  wareHouseId: string
  wareHouseName: string
  supplierId: string
  supplierName: string
  remarks?: string
  items: ReturnItem[]
}

const initialData: ReturnForm = {
  returnNo: '',
  returnDate: new Date().toISOString(),
  returnDueDate: new Date().toISOString(),
  invoiceId: '',
  branceId: '',
  branceName: '',
  wareHouseId: '',
  wareHouseName: '',
  supplierId: '',
  supplierName: '',
  remarks: '',
  items: [],
}

const ReturnItemRow = ({
  item,
  onChange,
  onRemove,
}: {
  item: ReturnItem
  onChange: (field: keyof ReturnItem, value: string | number) => void
  onRemove: () => void
}) => {
  const total = item.rate * item.quantity

  return (
    <TableRow>
      <TableCell>{item.productName}</TableCell>
      <TableCell>
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => onChange('quantity', Number(e.target.value))}
          placeholder="Quantity"
          min={0}
          className="!w-20"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          value={item.rate}
          onChange={(e) => onChange('rate', Number(e.target.value))}
          placeholder="Rate"
          min={0}
          className="!w-24"
        />
      </TableCell>
      <TableCell>
        <Input
          type="text"
          value={item.batch}
          onChange={(e) => onChange('batch', e.target.value)} // Fixed syntax error
          placeholder="Batch"
          className="!w-24"
        />
      </TableCell>
      <TableCell>
        <Input
          type="text"
          value={item.description}
          onChange={(e) => onChange('description', e.target.value)} // Fixed syntax error
          placeholder="Description"
          className="!w-32"
        />
      </TableCell>
      <TableCell>{total.toFixed(2)}</TableCell>
      <TableCell>
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700"
          type="button"
        >
          ✕
        </button>
      </TableCell>
    </TableRow>
  )
}

const AddReturn = () => {
  const [formData, setFormData] = useState<ReturnForm>(initialData)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { mutate } = useSWR('returnNum', getReturnNumber, {
    onSuccess(data) {
      setFormData((v) => ({ ...v, returnNo: data }))
    },
  })

  const handleItemChange = (
    index: number,
    field: keyof ReturnItem,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }))
  }

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async () => {
    setError(null)
    if (!formData.invoiceId) {
      return setError('Please select an invoice')
    }
    if (!formData.returnDate) {
      return setError('Please select a return date')
    }
    if (formData.items.length === 0) {
      return setError('Please add some items')
    }
    if (formData.items.some((i) => i.quantity <= 0)) {
      return setError('Quantity must be greater than 0')
    }

    try {
      setLoading(true)
      await createReturn(formData)
      toast.success('Return created successfully')
      setFormData((prev) => ({
        ...initialData,
        returnNo: prev.returnNo,
      }))
      mutate()
      setLoading(false)
    } catch (error: any) {
      setError(error?.message || 'Something went wrong in server')
      setLoading(false)
    }
  }

  const totalAmount = formData.items.reduce(
    (sum, item) => sum + item.rate * item.quantity,
    0
  )

  return (
    <div className="max-w-4xl mx-auto p-2 space-y-2">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Select Invoice</Label>
          <AsyncSelect
            label="Invoice"
            placeholder="Select Invoice"
            fetcher={getInvoicesForSelect}
            value={formData.invoiceId}
            onChange={(value, options) => {
              if (!value || !options) {
                return setFormData((prev) => ({
                  ...initialData,
                  returnNo: prev.returnNo,
                }))
              }

              const selectedInvoice: any = options.find(
                (opt: any) => opt.id === value
              )
              if (!selectedInvoice) return

              setFormData((prev) => ({
                ...prev,
                invoiceId: value,
                branceId: selectedInvoice.Branch?.id || '',
                branceName: selectedInvoice.Branch?.name || '',
                wareHouseId: selectedInvoice.Warehouse?.id || '',
                wareHouseName: selectedInvoice.Warehouse?.name || '',
                supplierId: selectedInvoice.Supplier?.id || '',
                supplierName: selectedInvoice.Supplier?.name || '',
                items:
                  selectedInvoice.InvoiceItems?.map((item: any) => ({
                    productId: item.productId,
                    productName: item.product?.name || '',
                    quantity: item.quantity || 0,
                    rate: item.rate,
                    batch: '',
                    description: '',
                  })) || [],
              }))
            }}
            getOptionValue={(option: any) => option.id}
            getDisplayValue={(option) => option.invoiceNo}
            renderOption={(option) => (
              <div>
                <span>{option.invoiceNo}</span>
                {option.InvoiceItems && (
                  <span className="text-gray-500 text-sm">
                    · {option.InvoiceItems.length} items
                  </span>
                )}
              </div>
            )}
          />
        </div>

        <InputParent
          labelTitle="Return No"
          placeholder="Return number"
          value={formData.returnNo}
          onChange={(e) =>
            setFormData((p) => ({ ...p, returnNo: e.target.value }))
          }
        />

        <div className="space-y-2">
          <Label>Return Date</Label>
          <DateInput
            className="block w-full"
            value={formData.returnDate}
            onChange={(v) =>
              setFormData((p) => ({ ...p, returnDate: v.toISOString() }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Return Due Date</Label>
          <DateInput
            className="block w-full"
            value={formData.returnDueDate}
            onChange={(v) =>
              setFormData((p) => ({ ...p, returnDueDate: v.toISOString() }))
            }
          />
        </div>

        <InputParent
          labelTitle="Branch"
          disabled
          value={formData.branceName}
          placeholder="Branch name will appear here"
          className="disabled:opacity-90"
        />

        <InputParent
          labelTitle="Warehouse"
          disabled
          value={formData.wareHouseName}
          placeholder="Warehouse name will appear here"
          className="disabled:opacity-90"
        />

        <InputParent
          labelTitle="Supplier"
          disabled
          value={formData.supplierName}
          placeholder="Supplier name will appear here"
          className="disabled:opacity-90"
        />
      </div>

      <div className="space-y-2">
        <Label>Remarks</Label>
        <Input
          type="text"
          placeholder="Remarks (optional)"
          value={formData.remarks}
          onChange={(e) =>
            setFormData((p) => ({ ...p, remarks: e.target.value }))
          }
        />
      </div>

      {formData.items.length > 0 && (
        <div className="space-y-3 !mt-5">
          <Label className="flex gap-2 items-center justify-center border-b pb-2 text-xl">
            Return Items
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
                  <TableHead>Total</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.items.map((item, index) => (
                  <ReturnItemRow
                    key={index}
                    item={item}
                    onChange={(field, value) =>
                      handleItemChange(index, field, value)
                    }
                    onRemove={() => removeItem(index)}
                  />
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>
                    Total Items: {formData.items.length}
                  </TableCell>
                  <TableCell colSpan={2} className="text-right">
                    Total Amount: {totalAmount.toFixed(2)} taka
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      )}

      <div className="!mt-5">
        {error && <div className="text-red-500 p-2">{error}</div>}
        <Button onClick={handleSubmit} className="w-full" disabled={loading}>
          Create Return
        </Button>
      </div>
    </div>
  )
}

export default AddReturn

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { getReturnNumber, getSalesInvoicesForSelect, createSealsReturn } from './action'
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
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ReturnItem {
  productId: string
  productName: string
  quantity: number
  rate: number
  unit: string
  total?: number
}

const initialData = {
  returnNo: '',
  returnDate: new Date().toISOString(),
  dueDate: new Date().toISOString(),
  invoiceId: '',
  branceId: '',
  branceName: '',
  wareHouseId: '',
  wareHouseName: '',
  customerId: '',
  customerName: '',
  address: '',
  customerLedger: '',
  salesLadger: '',
  remark: '',
  items: [] as ReturnItem[]
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
      <TableCell>{item.unit}</TableCell>
      <TableCell>
        <Input
          type="number"
          value={item.rate}
          onChange={(e) => onChange('rate', Number(e.target.value))}
          placeholder="Rate"
          min={0}
          className="!w-24"
          disabled
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

const AddSealsReturn = () => {
  const [formData, setFormData] = useState(initialData)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Fetch return number automatically
  const { mutate } = useSWR('returnNumber', getReturnNumber, {
    onSuccess: (data) => {
      setFormData(prev => ({ ...prev, returnNo: data }))
    }
  })
  const router = useRouter()
  const handleInvoiceSelect = (value: string, options?: any[]) => {
    if (!value || !options) {
      return setFormData(prev => ({
        ...initialData,
        returnNo: prev.returnNo,
      }))
    }

    const selectedInvoice = options.find((opt: any) => opt.id === value)
    if (!selectedInvoice) return

    setFormData(prev => ({
      ...prev,
      invoiceId: value,
      branceId: selectedInvoice.Branch?.id || '',
      branceName: selectedInvoice.Branch?.name || '',
      wareHouseId: selectedInvoice.Warehouse?.id || '',
      wareHouseName: selectedInvoice.Warehouse?.name || '',
      customerId: selectedInvoice.Customers?.id || '',
      customerName: selectedInvoice.Customers?.name || '',
      address: selectedInvoice.Customers?.address || '',
      customerLedger: selectedInvoice.customerLedger || '',
      salesLadger: selectedInvoice.salesledger || '',
      items: selectedInvoice.InvoiceItems?.map((item: any) => ({
        productId: item.productId,
        productName: item.product?.name || '',
        quantity: item.quantity || 0,
        rate: item.rate,
        unit: item.unit || '',
      })) || [],
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
    if (formData.items.some(i => i.quantity <= 0)) {
      return setError('Quantity must be greater than 0')
    }

    try {
      setLoading(true)
      await createSealsReturn(formData)
      toast.success('Return created successfully')
      setFormData(prev => ({
        ...initialData,
        returnNo: prev.returnNo,
      }))
      router.push('/sales/return')
      mutate()
      setLoading(false)
    } catch (error: any) {
      setError(error?.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-2 space-y-2">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {/* Updated Invoice Selection */}
        <div className="space-y-2">
          <Label>Select Invoice</Label>
          <AsyncSelect
            label="Invoice"
            placeholder="Select Sales Invoice"
            fetcher={getSalesInvoicesForSelect}
            value={formData.invoiceId}
            onChange={handleInvoiceSelect}
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
                {option.Customers?.name && (
                  <span className="text-gray-500 text-sm">
                    · {option.Customers.name}
                  </span>
                )}
              </div>
            )}
          />
        </div>

        {/* Updated Return Number field */}
        <InputParent
          labelTitle="Return No"
          placeholder="Return number"
          value={formData.returnNo}
          disabled
          className="disabled:opacity-90"
        />

        {/* Return Date */}
        <div className="space-y-2">
          <Label>Return Date</Label>
          <DateInput 
            className="block w-full"
            value={formData.returnDate}
            onChange={(v) => setFormData(p => ({ ...p, returnDate: v.toISOString() }))}
          />
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <Label>Due Date</Label>
          <DateInput 
            className="block w-full"
            value={formData.dueDate}
            onChange={(v) => setFormData(p => ({ ...p, dueDate: v.toISOString() }))}
          />
        </div>

        {/* Branch */}
        <InputParent
          labelTitle="Branch"
          disabled
          placeholder="Branch name will appear here"
          className="disabled:opacity-90"
        />

        {/* Warehouse */}
        <InputParent
          labelTitle="Warehouse"
          disabled
          placeholder="Warehouse name will appear here"
          className="disabled:opacity-90"
        />

        {/* Customer */}
        <InputParent
          labelTitle="Customer"
          disabled
          placeholder="Customer name will appear here"
          className="disabled:opacity-90"
        />

        {/* Customer Address */}
        <InputParent
          labelTitle="Address"
          disabled
          placeholder="Customer address will appear here"
          className="disabled:opacity-90"
        />
      </div>

      {/* Customer and Sales Ledger */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <InputParent
          labelTitle="Customer Ledger"
          placeholder="Customer ledger"
        />
        <InputParent
          labelTitle="Sales Ledger"
          placeholder="Sales ledger"
        />
      </div>

      {/* Remarks */}
      <div className="space-y-2">
        <Label>Remarks</Label>
        <Input 
          type="text" 
          placeholder="Remarks (optional)"
          value={formData.remark}
          onChange={(e) => setFormData(p => ({ ...p, remark: e.target.value }))}
        />
      </div>

      {/* Updated Items Table */}
      <div className="space-y-3 !mt-5">
        <div className="flex justify-between items-center border-b pb-2">
          <Label className="text-xl">Return Items</Label>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Product</TableHead>
                <TableHead>Return Qty</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Total</TableHead>
                {/* <TableHead className="w-[50px]">Action</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {formData.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No items added yet
                  </TableCell>
                </TableRow>
              ) : (
                formData.items.map((item, index) => (
                  <ReturnItemRow
                    key={item.productId + index}
                    item={item}
                    onChange={(field, value) =>
                      setFormData(prev => ({
                        ...prev,
                        items: prev.items.map((i, idx) =>
                          idx === index ? { ...i, [field]: value } : i
                        )
                      }))
                    }
                    onRemove={() =>
                      setFormData(prev => ({
                        ...prev,
                        items: prev.items.filter((_, idx) => idx !== index)
                      }))
                    }
                  />
                ))
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}>
                  Total Items: <span className="font-semibold">{formData.items.length}</span>
                </TableCell>
                <TableCell colSpan={3} className="text-right">
                  Total Amount: <span className="font-semibold">
                    {formData.items.reduce((sum, item) => sum + (item.rate * item.quantity), 0).toFixed(2)} taka
                  </span>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>

      {/* Submit Button */}
      <div className="!mt-5">
        {error && <div className="text-red-500 p-2">{error}</div>}
        <Button 
          onClick={handleSubmit} 
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Sales Return'}
        </Button>
      </div>
    </div>
  )
}

export default AddSealsReturn

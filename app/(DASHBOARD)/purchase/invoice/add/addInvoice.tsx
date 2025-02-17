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
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'
import { addInvoice, getChalanForSelect, getInvoiceNumber } from './action'

interface InvoiceItem {
  productId: string
  productName: string
  quantity: number
  rate: string
  batch: string
  discount: number
  description: string
}

interface InvoiceForm {
  invoiceNo: string
  invoideDate: string
  challanId: string
  branceId: string
  branceName: string
  wareHouseId: string
  wareHouseName: string
  supplierId: string
  supllayerName: string
  address: string
  remarks?: string
  InvoiceAmmount: string
  items: InvoiceItem[]
}

const initialData: InvoiceForm = {
  invoiceNo: '',
  invoideDate: new Date().toISOString(),
  challanId: '',
  branceId: '',
  branceName: '',
  wareHouseId: '',
  wareHouseName: '',
  supplierId: '',
  supllayerName: '',
  address: '',
  remarks: '',
  InvoiceAmmount: '0',
  items: [],
}

const ProductInput = ({
  item,
  onChange,
}: {
  item: InvoiceItem
  onChange: (field: keyof InvoiceItem, value: string | number) => void
}) => {
  const subtotal = Number(item.rate) * item.quantity
  const discountAmount = (subtotal * Number(item.discount)) / 100
  const totalAfterDiscount = subtotal - discountAmount

  return (
    <TableRow>
      <TableCell>
      {item.productName}
      </TableCell>
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
          onChange={(e) => onChange('rate', e.target.value)}
          placeholder="Rate"
          min={0}
          className="!w-24"
        />
      </TableCell>
      <TableCell>{subtotal.toFixed(2)}</TableCell>
      <TableCell>
        <Input
          type="text"
          value={item.batch}
          placeholder="Batch"
          onChange={(e) => onChange('batch', e.target.value)}
          className="!w-20"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          className="!w-16"
          value={item.discount}
          placeholder="Discount (%)"
          onChange={(e) => onChange('discount', Number(e.target.value))}
          onClick={(e) => e.currentTarget.select()}
          min={0}
          max={100}
        />
      </TableCell>
      <TableCell>
        <Input
          type="text"
          className="!w-24"
          value={item.description}
          placeholder="Description"
          onChange={(e) => onChange('description', e.target.value)}
        />
      </TableCell>
      <TableCell className="">{totalAfterDiscount.toFixed(2)}</TableCell>
    </TableRow>
  )
}

const AddInvoice = () => {
  const [formData, setFormData] = useState<InvoiceForm>(initialData)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { mutate } = useSWR('invoiceNum', getInvoiceNumber, {
    onSuccess(data) {
      setFormData((v) => ({ ...v, invoiceNo: data }))
    },
  })

  useEffect(() => {
    const total = formData.items.reduce((sum, item) => {
      const subtotal = Number(item.rate) * item.quantity
      const discountAmount = (subtotal * Number(item.discount)) / 100
      return sum + (subtotal - discountAmount)
    }, 0)
    setFormData((prev) => ({ ...prev, InvoiceAmmount: total.toFixed(2) }))
  }, [formData.items])

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }))
  }

  const handleSubmit = async () => {
    setError(null)
    if (!formData.challanId && formData.challanId !== '') {
      return setError('Please select a challan')
    }
    if (!formData.invoideDate && formData.invoideDate !== '') {
      return setError('Please select a invoice date')
    }
    if (!formData.address && formData.invoideDate !== '') {
      return setError('Please enter delivery address')
    }
    if (formData.items.length === 0) {
      return setError('Please add some items')
    }
    if (formData.items.some((i) => i.quantity <= 0)) {
      return setError('Quantity must be greater than 0')
    }
    if (formData?.invoiceNo === '') {
      return setError('Invoice number is required')
    }
    try {
      setLoading(true)
      await addInvoice(formData)
      toast.success('Invoice created successfully')
      setFormData(initialData)
      mutate()
      setLoading(false)
    } catch (error: any) {
      console.log(error)
      setError(
        error?.message ? error.message : 'Something went wrong in server'
      )
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-2 space-y-2">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Select Challan</Label>
          <AsyncSelect
            label="Challan"
            placeholder="Select Challan"
            fetcher={getChalanForSelect}
            renderOption={(item:any) => (
              <>
                {item.challanNo} · {item._count.ChallanItems} Items
              </>
            )}
            getOptionValue={(item) => item.id}
            getDisplayValue={(item) =>
              `${item.challanNo} · ${item._count.ChallanItems} Items`
            }
            value={formData.challanId}
            onChange={(e, options) => {
              if (e === '') {
                return setFormData((v) => ({
                  ...initialData,
                  invoiceNo: v.invoiceNo,
                }))
              }
              const f = options?.find((i) => i.id === e)

              setFormData((v) => ({
                ...v,
                challanId: e,
                branceId: f?.Branch?.id || '',
                branceName: f?.Branch?.name || '',
                wareHouseId: f?.Warehouse?.id || '',
                wareHouseName: f?.Warehouse?.name || '',
                supplierId: f?.Supplier?.id || '',
                supllayerName: f?.Supplier?.name || '',
                address: f?.supingAddress || '',
                items:
                  f?.ChallanItems?.map((i) => ({
                    productId: i.product?.id || '',
                    productName: i.product?.name || '',
                    quantity: i.quantity,
                    rate: i.rate.toString(),
                    batch: '',
                    discount: 0,
                    description: '',
                  })) || [],
              }))
            }}
          />
        </div>
        <div className="space-y-2">
          <Label>Invoice No</Label>
          <Input
            type="text"
            placeholder="Invoice number"
            defaultValue={formData.invoiceNo}
          />
        </div>

        <div className="space-y-2">
          <Label>Invoice Date</Label>
          <DateInput
            className="block w-full"
            value={formData.invoideDate}
            onChange={(v) =>
              setFormData((p) => ({ ...p, invoideDate: v.toISOString() || '' }))
            }
          />
        </div>

        <InputParent
          labelTitle="Branch"
          disabled
          placeholder="branch"
          defaultValue={formData.branceName}
          className="disabled:opacity-90"
        />

        <InputParent
          labelTitle="Warehouse"
          disabled
          placeholder="warehouse"
          defaultValue={formData.wareHouseName}
          className="disabled:opacity-90"
        />

        <InputParent
          labelTitle="Supplier"
          disabled
          placeholder="supplier"
          defaultValue={formData?.supllayerName}
          className="disabled:opacity-90"
        />
      </div>

      <div className="space-y-2">
        <Label>Address</Label>
        <Input
          type="text"
          placeholder="Delivery Address"
          value={formData.address}
          onChange={(e) =>
            setFormData((p) => ({ ...p, address: e.target.value }))
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Remarks</Label>
        <Input type="text" placeholder="Remarks (optional)" />
      </div>

      {formData.items.length > 0 && (
        <div className="space-y-3 !mt-5">
          <Label className="flex gap-2 items-center justify-center border-b pb-2 text-xl">
            Invoice Items
          </Label>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="">Quantity</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Discount(%)</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Sub-Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.items.map((item, index) => (
                  <ProductInput
                    key={index}
                    item={item}
                    onChange={(field, value) =>
                      handleItemChange(index, field, value)
                    }
                  />
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5}>
                    Total Items: {formData.items.length}
                  </TableCell>
                  <TableCell colSpan={2} className="text-right">
                    Total Amount: {formData.InvoiceAmmount} taka
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
          Create Invoice
        </Button>
      </div>
    </div>
  )
}

export default AddInvoice

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { AsyncSelect } from '@/components/ui/async-select'
import { Button } from '@/components/ui/button'
import DateInput from '@/components/ui/DateInput'
import { Input } from '@/components/ui/input'
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
import { useState, useEffect } from 'react'
import {
  getSalesChallanForSelect,
  getInvoiceNumber,
  addSalesInvoice,
} from './action'
import useSWR from 'swr'
import { toast } from 'sonner'

interface InvoiceItem {
  productId: string
  productName: string
  quantity: number
  rate: number
  unit: string
  batch: string
  discount: number
}

const ProductRow = ({
  item,
  onChange,
}: {
  item: InvoiceItem
  onChange: (field: keyof InvoiceItem, value: string | number) => void
}) => {
  const totalAmount = item.quantity * item.rate
  const discountAmount = (totalAmount * item.discount) / 100
  const netAmount = totalAmount - discountAmount

  return (
    <TableRow>
      <TableCell>{item.productName}</TableCell>
      <TableCell>
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => onChange('quantity', Number(e.target.value))}
          className="!w-20"
          min={0}
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          value={item.rate}
          onChange={(e) => onChange('rate', Number(e.target.value))}
          className="!w-24"
          min={0}
        />
      </TableCell>
      <TableCell>{item.unit}</TableCell>
      <TableCell>{totalAmount.toFixed(2)}</TableCell>
      <TableCell>
        <Input
          type="number"
          value={item.discount}
          onChange={(e) => onChange('discount', Number(e.target.value))}
          className="!w-16"
          min={0}
          max={100}
        />
      </TableCell>
      <TableCell>
        <Input
          type="text"
          value={item.batch}
          placeholder="Enter batch number"
          onChange={(e) => onChange('batch', e.target.value)}
          className="!w-20"
        />
      </TableCell>
      <TableCell className="font-medium">{netAmount.toFixed(2)}</TableCell>
    </TableRow>
  )
}

const AddInvoice = () => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    invoiceNo: '',
    invoiceDate: new Date().toISOString(),
    deliveryDate: new Date().toISOString(),
    branchId: '',
    warehouseId: '',
    customerId: '',
    salesLedger: '',
    customerLedger: '',
    salesExecutiveId: '',
    executiveMobile: '',
    challanId: '',
    address: '',
    remarks: '',
    items: [] as InvoiceItem[],
    netAmount: '0',
    branchName: '', // Add these new fields
    warehouseName: '',
    customerName: '',
    executiveName: '',
  })

  const { mutate } = useSWR('invoiceNum', getInvoiceNumber, {
    onSuccess(data) {
      setFormData((v) => ({ ...v, invoiceNo: data }))
    },
  })

  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    try {
      setError(null)
      setLoading(true)

      // Validation
      if (!formData.challanId) {
        throw new Error('Please select a delivery challan')
      }
      if (!formData.salesLedger) {
        throw new Error('Sales ledger is required')
      }
      if (!formData.customerLedger) {
        throw new Error('Customer ledger is required')
      }
      if (!formData.address) {
        throw new Error('Delivery address is required')
      }
      if (formData.items.length === 0) {
        throw new Error('No items in invoice')
      }
      if (formData.items.some((item) => !item.rate || item.rate <= 0)) {
        throw new Error('All items must have a valid rate')
      }
      if (formData.items.some((item) => !item.batch)) {
        throw new Error('All items must have a batch number')
      }

      await addSalesInvoice(formData)

      toast.success('Sales invoice created successfully')

      // Reset form
      setFormData((prev) => ({
        ...prev,
        challanId: '',
        branchId: '',
        branchName: '',
        warehouseId: '',
        warehouseName: '',
        customerId: '',
        customerName: '',
        address: '',
        salesExecutiveId: '',
        executiveName: '',
        executiveMobile: '',
        salesLedger: '',
        customerLedger: '',
        remarks: '',
        items: [],
        netAmount: '0',
      }))

      mutate() // Refresh invoice number
    } catch (err: any) {
      setError(err?.message || 'Failed to create invoice')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const total = formData.items.reduce((sum, item) => {
      const subtotal = item.quantity * item.rate
      const discountAmount = (subtotal * item.discount) / 100
      return sum + (subtotal - discountAmount)
    }, 0)
    setFormData((prev) => ({
      ...prev,
      netAmount: total.toFixed(2),
    }))
  }, [formData.items])

  return (
    <div className="max-w-4xl mx-auto p-2 space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Invoice Number</Label>
          <Input
            type="text"
            value={formData.invoiceNo || ''}
            placeholder="Auto generated"
            readOnly
          />
        </div>

        <div className="space-y-2">
          <Label>Select Challan</Label>
          <AsyncSelect
            placeholder="Search delivery challan..."
            fetcher={getSalesChallanForSelect}
            renderOption={(item: any) => (
              <>
                {item.salessChallanNo} · {item._count.sealsChallanItems} Items
              </>
            )}
            getOptionValue={(item) => item.id}
            getDisplayValue={(item) =>
              `${item.salessChallanNo} · ${item._count.sealsChallanItems} Items`
            }
            value={formData.challanId}
            onChange={(challanId, options) => {
              if (challanId === '') {
                return setFormData((prev) => ({
                  ...prev,
                  challanId: '',
                  branchId: '',
                  branchName: '',
                  warehouseId: '',
                  warehouseName: '',
                  customerId: '',
                  customerName: '',
                  address: '',
                  salesExecutiveId: '',
                  executiveName: '',
                  executiveMobile: '',
                  items: [],
                }))
              }

              const selectedChallan = options?.find((i) => i.id === challanId)
              if (!selectedChallan) return

              setFormData((prev) => ({
                ...prev,
                challanId: challanId,
                branchId: selectedChallan.Branch?.id || '',
                branchName: selectedChallan.Branch?.name || '',
                warehouseId: selectedChallan.Warehouse?.id || '',
                warehouseName: selectedChallan.Warehouse?.name || '',
                customerId: selectedChallan.Customers?.id || '',
                customerName: selectedChallan.Customers?.name || '',
                address: selectedChallan.addreess || '',
                salesExecutiveId: selectedChallan.sealsExucutive?.id || '',
                executiveName: selectedChallan.sealsExucutive?.name || '',
                executiveMobile: selectedChallan.exclusiveMobile || '',
                items:
                  selectedChallan.sealsChallanItems?.map((item) => ({
                    productId: item.product?.id || '',
                    productName: item.product?.name || '',
                    quantity: item.quantity,
                    rate: 0,
                    unit: item.product?.productUnit?.unit || '',
                    batch: '',
                    discount: 0,
                  })) || [],
              }))
            }}
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <Label>Invoice Date</Label>
          <DateInput
            value={formData.invoiceDate}
            onChange={(date) =>
              setFormData((prev) => ({
                ...prev,
                invoiceDate: date.toISOString(),
              }))
            }
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <Label>Delivery Date</Label>
          <DateInput
            value={formData.deliveryDate}
            onChange={(date) =>
              setFormData((prev) => ({
                ...prev,
                deliveryDate: date.toISOString(),
              }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Branch</Label>
          <Input
            type="text"
            disabled
            value={formData.branchName || ''}
            placeholder="Auto-filled from challan"
            className="disabled:opacity-90"
          />
        </div>

        <div className="space-y-2">
          <Label>Warehouse</Label>
          <Input
            type="text"
            disabled
            value={formData.warehouseName || ''}
            placeholder="Auto-filled from challan"
            className="disabled:opacity-90"
          />
        </div>

        <div className="space-y-2">
          <Label>Customer</Label>
          <Input
            type="text"
            disabled
            value={formData.customerName || ''}
            placeholder="Auto-filled from challan"
            className="disabled:opacity-90"
          />
        </div>

        <div className="space-y-2">
          <Label>Sales Executive</Label>
          <Input
            type="text"
            disabled
            value={formData.executiveName || ''}
            placeholder="Auto-filled from challan"
            className="disabled:opacity-90"
          />
        </div>

        <div className="space-y-2">
          <Label>Sales Ledger</Label>
          <Input
            type="text"
            value={formData.salesLedger || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                salesLedger: e.target.value,
              }))
            }
            placeholder="Enter sales ledger account"
          />
        </div>

        <div className="space-y-2">
          <Label>Customer Ledger</Label>
          <Input
            type="text"
            value={formData.customerLedger}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                customerLedger: e.target.value,
              }))
            }
            placeholder="Enter customer ledger account"
          />
        </div>

        <div className="space-y-2">
          <Label>Sales Executive Mobile</Label>
          <Input
            type="tel"
            value={formData.executiveMobile}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                executiveMobile: e.target.value,
              }))
            }
            placeholder="Enter executive's mobile number"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Delivery Address</Label>
        <Input
          type="text"
          value={formData.address}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              address: e.target.value,
            }))
          }
          placeholder="Enter complete delivery address"
        />
      </div>

      <div className="space-y-2">
        <Label>Remarks</Label>
        <Input
          type="text"
          value={formData.remarks}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              remarks: e.target.value,
            }))
          }
          placeholder="Any additional notes (optional)"
        />
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
                  <TableHead>Product Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Discount(%)</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Net Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.items.map((item, index) => (
                  <ProductRow
                    key={index}
                    item={item}
                    onChange={(field, value) => {
                      const newItems = [...formData.items]
                      newItems[index] = { ...newItems[index], [field]: value }
                      setFormData((prev) => ({
                        ...prev,
                        items: newItems,
                      }))
                    }}
                  />
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>
                    Total Items: {formData.items.length}
                  </TableCell>
                  <TableCell colSpan={3} className="text-right font-medium">
                    Net Amount:
                  </TableCell>
                  <TableCell className="font-bold">
                    {formData.netAmount} taka
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm mt-3">
          {error}
        </div>
      )}

      <Button
        className="w-full"
        disabled={loading || formData.items.length === 0}
        onClick={handleSubmit}
      >
        {loading ? 'Creating Invoice...' : 'Create Sales Invoice'}
      </Button>
    </div>
  )
}

export default AddInvoice

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { AsyncSelect } from '@/components/ui/async-select'
import { Button } from '@/components/ui/button'
import DateInput from '@/components/ui/DateInput'
import { InputParent } from '@/components/ui/input'
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
import { getOrderForSelect, getOrderInForChallan, createChallan } from './action'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface ChallanItem {
  productName: string
  quantity: number
  rate: number
  batchNo: string
  description: string
  productId: string
}

interface FormData {
  orderId: string
  challanNumber: string
  challanDate: Date
  challanDueDate: Date
  orderDate: string
  dueOrderDate: string
  branch: string
  branceId: string
  warehouse: string
  warehouseId: string
  supplier: string
  supplierId: string
  shippingAddress: string
  remarks: string
  items: ChallanItem[]
}

const initialFormData: FormData = {
  orderId: '',
  challanNumber: '',
  challanDate: new Date(),
  challanDueDate: new Date(),
  orderDate: '',
  dueOrderDate: '',
  branch: '',
  branceId: '',
  warehouse: '',
  supplierId: '',
  supplier: '',
  warehouseId: '',
  shippingAddress: '',
  remarks: '',
  items: [],
}

const ChallanItemInput = ({
  index,
  item,
  onChange,
}: {
  index: number
  item: ChallanItem
  onChange: (index: number, data: Partial<ChallanItem>) => void
}) => {
  const totalAmount = item.quantity * item.rate

  return (
    <TableRow>
      <TableCell>
        <InputParent
          type="text"
          placeholder="Name"
          value={item.productName}
          disabled
          className="disabled:opacity-90"
        />
      </TableCell>
      <TableCell>
        <InputParent
          type="number"
          placeholder="Quantity"
          value={item.quantity}
          onChange={(e) =>
            onChange(index, { quantity: Number(e.target.value) })
          }
          disabled
          className="disabled:opacity-90"
        />
      </TableCell>
      <TableCell>
        <InputParent
          type="number"
          placeholder="Rate"
          value={item.rate}
          onChange={(e) => onChange(index, { rate: Number(e.target.value) })}
          disabled
          className="disabled:opacity-90"
        />
      </TableCell>
      <TableCell>
        <InputParent
          type="number"
          placeholder="Total Amount"
          value={totalAmount}
          disabled
          className="disabled:opacity-90"
        />
      </TableCell>
      <TableCell>
        <InputParent
          placeholder="Batch No"
          value={item.batchNo}
          onChange={(e) => onChange(index, { batchNo: e.target.value })}
        />
      </TableCell>
      <TableCell>
        <InputParent
          placeholder="Description"
          value={item.description}
          onChange={(e) => onChange(index, { description: e.target.value })}
        />
      </TableCell>
    </TableRow>
  )
}

const AddChalan = ({ chNum }: { chNum: string }) => {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [loading, setLoading] = useState(false)

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  useEffect(() => {
    setFormData((prev) => ({ ...prev, challanNumber: chNum }))
  }, [chNum])

  const handleItemChange = (index: number, data: Partial<ChallanItem>) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, ...data } : item
      ),
    }))
  }

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      if (formData?.orderId) {
        const order = (await getOrderInForChallan(formData.orderId)) as any
    
        setFormData((prev) => ({
          ...prev,
          orderDate: order.orderDate.toISOString().split('T')[0],
          dueOrderDate: order.dueDate.toISOString().split('T')[0],
          branch: order.Branch.name,
          branceId: order.Branch.id,
          warehouse: order.Warehouse.name,
          warehouseId: order.Warehouse.id,
          supplier: order.Supplier.name,
          supplierId: order.Supplier.id,
          shippingAddress: order.supingAddress,
          items: order.OrderItems.map((item: any) => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            rate: item.price,
            batchNo: '',
            description: '',
          })),
        }))
      }
      setLoading(false)
    }
    fetch()
  }, [formData?.orderId])

  const hendelChalan = async () => {
    try {
      setLoading(true)
      
      // Validate required fields
      if (!formData.orderId || !formData.challanNumber || formData.items.length === 0) {
        toast.error('Please fill all required fields')
        return
      }

      // Transform data for API
      const challanData = {
        orderId: formData.orderId,
        challanNumber: formData.challanNumber,
        challanDate: formData.challanDate,
        challanDueDate: formData.challanDueDate,
        branceId: formData.branceId,
        warehouseId: formData.warehouseId,
        supplierId: formData.supplierId,
        shippingAddress: formData.shippingAddress,
        remarks: formData.remarks,
        items: formData.items.map((item) => ({
          quantity: item.quantity,
          rate: item.rate,
          batch: item.batchNo,
          description: item.description,
          productId: item.productId // Make sure to add productId to your FormData interface
        }))
      }
 
      const response = await createChallan(challanData)
      
      if (response.success) {
        toast.success('Challan created successfully')
        router.push('/purchase/challan') // Redirect to challan list
        router.refresh()
      } else {
        toast.error(response.error || 'Failed to create challan')
      }
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // Add this function to calculate total price
  const calculateTotalPrice = () => {
    return formData.items.reduce((total, item) => {
      return total + (item.quantity * item.rate)
    }, 0)
  }

  return (
    <div className="max-w-4xl mx-auto p-2">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label>Order</Label>
            <AsyncSelect
              label="Order"
              placeholder="Select Order"
              fetcher={getOrderForSelect}
              renderOption={(item:any) => (
                <>
                  {item.orderNo} · {item._count.OrderItems} Items
                </>
              )}
              getOptionValue={(item) => item.id}
              getDisplayValue={(item) =>
                `${item.orderNo} · ${item._count.OrderItems} Items`
              }
              value={formData.orderId}
              onChange={(v) => handleChange('orderId', v)}
            />
          </div>
          <InputParent
            labelTitle="Challan Number"
            placeholder="Enter challan number"
            value={formData.challanNumber}
            onChange={(e) => handleChange('challanNumber', e.target.value)}
          />

          <div className="space-y-1">
            <Label>Challan Date</Label>
            <DateInput
              className="w-full block"
              value={formData.challanDate}
              onChange={(date) => handleChange('challanDate', date)}
            />
          </div>
          <div className="space-y-1">
            <Label>Challan Due Date</Label>
            <DateInput
              className="w-full block"
              value={formData.challanDueDate}
              onChange={(date) => handleChange('challanDueDate', date)}
            />
          </div>

          <InputParent
            labelTitle="Order Date"
            placeholder="Date"
            value={formData.orderDate}
            disabled
            className="disabled:opacity-90"
          />
          <InputParent
            labelTitle="Due Order Date"
            placeholder="Date"
            value={formData.dueOrderDate}
            disabled
            className="disabled:opacity-90"
          />

          <InputParent
            labelTitle="Branch"
            placeholder="Branch"
            value={formData.branch}
            disabled
            className="disabled:opacity-90"
          />
          <InputParent
            labelTitle="Warehouse"
            placeholder="Warehouse"
            value={formData.warehouse}
            disabled
            className="disabled:opacity-90"
          />
          <InputParent
            labelTitle="Supplier"
            placeholder="Supplier"
            value={formData.supplier}
            disabled
            className="disabled:opacity-90"
          />
        </div>
        <InputParent
          labelTitle="Shipping Address"
          placeholder="Enter shipping address"
          value={formData.shippingAddress}
          disabled
          className="disabled:opacity-90"
        />
        <InputParent
          labelTitle="Remarks"
          isTextArea
          placeholder="Add notes or remarks..."
          value={formData.remarks}
          onChange={(e) => handleChange('remarks', e.target.value)}
        />

        {formData.items.length > 0 && (
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
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.items.map((item, i) => (
                    <ChallanItemInput
                      key={i}
                      index={i}
                      item={item}
                      onChange={handleItemChange}
                    />
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={2} className="text-right font-medium">
                      Total Items: {formData.items.length}
                    </TableCell>
                    <TableCell colSpan={2} className="text-right font-medium">
                      Total Amount: ৳ {calculateTotalPrice().toFixed(2)}
                    </TableCell>
                    <TableCell colSpan={2}></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>
        )}

        <Button className="w-full" disabled={loading} onClick={hendelChalan}>
          Submit Challan
        </Button>
      </div>
    </div>
  )
}

export default AddChalan

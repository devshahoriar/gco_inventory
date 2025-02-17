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
} from "@/components/ui/table"
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  getBrancesForSelect,
  getSuppliersForSelect,
  getWarehousesForSelect,
} from '../../add/action'
import { updateOrder } from './action'

interface OrderItem {
  productId: string
  productName: string
  groupId: string
  groupName: string
  quantity: number
  unit: string
  rate: string
  remark?: string
}

const ProductInput = ({
  item,
  onChangePrice,
}: {
  item: OrderItem
  onChangePrice: (value: string) => void
}) => (
  <TableRow>
    <TableCell>{item.groupName}</TableCell>
    <TableCell>{item.productName}</TableCell>
    <TableCell className="text-right">{item.quantity} {item.unit}</TableCell>
    <TableCell>
      <Input
        type="text"
        placeholder="0.00"
        value={item.rate ?? ''}
        onChange={(e) => onChangePrice(e.target.value)}
        className="w-full"
      />
    </TableCell>
    <TableCell className="text-right">
      {(parseFloat(item.rate || '0') * (item.quantity || 0)).toFixed(2)}
    </TableCell>
  </TableRow>
)

const EditOrder = ({ initialData }: { initialData: any }) => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    orderNo: initialData.orderNo,
    orderDate: new Date(initialData.orderDate).toISOString(),
    deuDate: new Date(initialData.dueDate).toISOString(),
    branchId: initialData.branceId,
    warehouseId: initialData.warehouseId,
    supplierId: initialData.supplierId,
    shippingAddress: initialData.supingAddress,
    remark: initialData.remarks || '',
    products: initialData.OrderItems.map((item: any) => ({
      productId: item.product.id,
      productName: item.product.name,
      groupId: item.product.ProductGroup.id,
      groupName: item.product.ProductGroup.name,
      quantity: item.quantity,
      unit: item.product.productUnit.name,
      rate: item.price.toString(),
    })),
  })

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const updateProductPrice = (index: number, rate: string) => {
    setFormData((prev) => {
      const newProducts = [...prev.products]
      newProducts[index] = { ...newProducts[index], rate: rate || '' }
      return { ...prev, products: newProducts }
    })
  }

  const handleSubmit = async () => {
    setError(null)
    if (!formData.supplierId || !formData.warehouseId || !formData.branchId) {
      setError('Please add supplier, warehouse and branch.')
      return
    }
    if (formData.products.some((p:any) => Number(p?.rate) <= 0)) {
      setError('Please enter price for all products')
      return
    }
    setLoading(true)
    try {
      await updateOrder(initialData.id, formData)
      toast.success('Order updated successfully')
      router.push('/purchase/order')
      router.refresh()
    } catch (error: any) {
      setError(error?.message || 'Failed to update order')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-2 space-y-2">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Order No</Label>
          <Input type="text" value={formData.orderNo} disabled />
        </div>

        <div className="space-y-2">
          <Label>Order Date</Label>
          <DateInput
            className="block w-full"
            value={formData.orderDate ? new Date(formData.orderDate) : new Date()}
            onChange={(date) =>
              handleChange('orderDate', date?.toISOString() || '')
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Due Date</Label>
          <DateInput
            className="block w-full"
            value={formData.deuDate ? new Date(formData.deuDate) : new Date()}
            onChange={(date) =>
              handleChange('deuDate', date?.toISOString() || '')
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Select Branch</Label>
          <AsyncSelect
            fetcher={(v) => getBrancesForSelect(v, formData.branchId)}
            renderOption={(item:any) => <>{item.name}</>}
            getOptionValue={(item) => item.id}
            getDisplayValue={(item) => item.name}
            label="Branch"
            placeholder="Branch"
            value={formData.branchId}
            onChange={(value) => handleChange('branchId', value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Select Warehouse</Label>
          <AsyncSelect
            fetcher={(v) => getWarehousesForSelect(v, formData.warehouseId)}
            renderOption={(item:any) => <>{item.name}</>}
            getOptionValue={(item) => item.id}
            getDisplayValue={(item) => item.name}
            label="Warehouse"
            placeholder="Warehouse"
            value={formData.warehouseId}
            onChange={(value) => handleChange('warehouseId', value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Select Supplier</Label>
          <AsyncSelect
            fetcher={(v) => getSuppliersForSelect(v, formData.supplierId)}
            renderOption={(item:any) => <>{item.name}</>}
            getOptionValue={(item) => item.id}
            getDisplayValue={(item) => item.name}
            label="Supplier"
            placeholder="Supplier"
            value={formData.supplierId}
            onChange={(value) => handleChange('supplierId', value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Shipping Address</Label>
        <Input
          type="text"
          placeholder="Address"
          value={formData.shippingAddress}
          onChange={(e) => handleChange('shippingAddress', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Remark</Label>
        <Input
          type="text"
          placeholder="Remark"
          value={formData.remark}
          onChange={(e) => handleChange('remark', e.target.value)}
        />
      </div>

      <div className="space-y-3 !mt-5">
        <Label className="flex gap-2 items-center justify-center border-b pb-2 text-xl">
          Products
        </Label>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formData.products.map((item:any, index:number) => (
                <ProductInput
                  key={`${item.productId}-${index}`}
                  item={item}
                  onChangePrice={(value) => updateProductPrice(index, value)}
                />
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}>
                  Total Items: {formData.products.length}
                </TableCell>
                <TableCell colSpan={3} className="text-right">
                  Total Amount: {formData.products.reduce(
                    (acc:any, item:any) => acc + Number(item.quantity) * Number(item.rate),
                    0
                  ).toFixed(2)} taka
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>

      <div className="!mt-5">
        {error && <div className="text-red-500 p-2">{error}</div>}
        <Button onClick={handleSubmit} className="w-full" disabled={loading}>
          Update Order
        </Button>
      </div>
    </div>
  )
}

export default EditOrder

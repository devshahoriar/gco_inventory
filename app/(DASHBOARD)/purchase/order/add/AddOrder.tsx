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
import { Loader } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'
import {
  createOrder,
  getBrancesForSelect,
  getOrderNo,
  getPreRequisition,
  getRegesitionForSelect,
  getSuppliersForSelect,
  getWarehousesForSelect,
} from './action'
import Link from 'next/link'

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
    <TableCell className="text-right">
      {item.quantity} {item.unit}
    </TableCell>
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

interface OrderForm {
  regId: string
  orderNo: string
  orderDate: string
  regDate: string | Date
  deuDate: string
  branchId: string
  warehouseId: string
  supplierId: string
  shippingAddress: string
  remark: string
  products: OrderItem[]
}

const initialData = {
  regId: '',
  orderNo: '',
  orderDate: new Date().toISOString(),
  deuDate: new Date().toISOString(),
  regDate: '',
  branchId: '',
  warehouseId: '',
  supplierId: '',
  shippingAddress: '',
  remark: '',
  products: [],
}

const AddOrder = () => {
  const [fromdata, setFormData] = useState<OrderForm>(initialData)
  const [canOrder, setCanOrder] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { data: regData, isLoading: reqLOading } = useSWR(
    fromdata?.regId ? 'pre' + fromdata.regId : null,
    () => getPreRequisition(fromdata.regId)
  )

  const { mutate, isLoading } = useSWR(
    fromdata?.orderNo ? null : 'orderNo' + fromdata.orderNo,
    () => getOrderNo(),
    {
      onSuccess: (data) => {
        setFormData((prev) => ({ ...prev, orderNo: data }))
      },
    }
  )

  useEffect(() => {
    if (regData) {
      setFormData((prev) => ({
        ...prev,
        regDate: new Date(regData?.reqDate).toISOString(),
        products: regData.reqItems.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          groupId: item.product.ProductGroup.id,
          groupName: item.product.ProductGroup.name,
          quantity: item.quantity,
          unit: item.product.productUnit.name,
          rate: '0',
        })),
      }))
    }
  }, [regData])

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

  const hendelSubmit = async () => {
    setError(null)
    if (!fromdata.regId) {
      setError('Please select regesition')
      return
    }
    if (
      !fromdata.orderNo ||
      !fromdata.supplierId ||
      !fromdata.warehouseId ||
      !fromdata.branchId
    ) {
      setError('Please add order no, supplier, warehouse and branch.')
      return
    }
    if (fromdata?.products?.length === 0) {
      setError('Invalid products')
      return
    }
    if (fromdata?.shippingAddress === '') {
      setError('Please enter shipping address')
      return
    }
    if (fromdata.products.some((p) => Number(p?.rate) <= 0)) {
      setError('Please enter price for all products')
      return
    }
    setLoading(true)
    try {
      await createOrder(fromdata)
      setFormData(initialData)
      setLoading(false)
      toast.success('Order added successfully')
      mutate()
    } catch (error: any) {
      setError(error?.message || 'Failed to add order')
    }
  }

  if (canOrder) {
    return (
      <div className="max-w-4xl mx-auto p-2 space-y-2">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Select Regesition</Label>

            <AsyncSelect
              fetcher={async (v) => {
                const x = await getRegesitionForSelect(v, fromdata.regId)
                if (x.length === 0) {
                  setError('No regesition found')
                  setCanOrder(false)
                } else {
                  setError(null)
                  setCanOrder(true)
                }
                return x
              }}
              renderOption={(item) => (
                <div>
                  {item.regNumber} · {item._count.reqItems} Items
                </div>
              )}
              getOptionValue={(item) => item.id}
              getDisplayValue={(item) =>
                `${item.regNumber} · ${item._count.reqItems} Items`
              }
              label="Regesition"
              placeholder="Regesition"
              value={fromdata.regId}
              onChange={(v) => {
                setFormData({ ...initialData, orderNo: fromdata.orderNo })
                handleChange('regId', v)
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Reqesition Date</Label>
            <Input
              type="date"
              onChange={(e) => e.preventDefault()}
              value={
                fromdata.regDate && new Date()?.toISOString().split('T')[0]
              }
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label>Order No</Label>
            <Input
              disabled={isLoading}
              type="text"
              placeholder="eng: order-1"
              value={fromdata.orderNo}
              onChange={(e) => handleChange('orderNo', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Order Date</Label>
            <DateInput
              className="block w-full"
              value={
                fromdata.orderDate ? new Date(fromdata.orderDate) : new Date()
              }
              onChange={(date) =>
                handleChange('orderDate', date?.toISOString() || '')
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Deu Date</Label>
            <DateInput
              className="block w-full"
              value={fromdata.deuDate ? new Date(fromdata.deuDate) : new Date()}
              onChange={(date) =>
                handleChange('deuDate', date?.toISOString() || '')
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Select Branch</Label>

            <AsyncSelect
              fetcher={(v) => getBrancesForSelect(v, fromdata.branchId)}
              renderOption={(item) => <>{item.name}</>}
              getOptionValue={(item) => item.id}
              getDisplayValue={(item) => item.name}
              label="Branch"
              placeholder="Branch"
              value={fromdata.branchId}
              onChange={(value) => handleChange('branchId', value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Select Warehouse</Label>

            <AsyncSelect
              fetcher={(v) => getWarehousesForSelect(v, fromdata.warehouseId)}
              renderOption={(item) => <>{item.name}</>}
              getOptionValue={(item) => item.id}
              getDisplayValue={(item) => item.name}
              label="Branch"
              placeholder="Warehouse"
              value={fromdata.warehouseId}
              onChange={(value) => handleChange('warehouseId', value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Select Supllayers</Label>
            <AsyncSelect
              fetcher={(v) => getSuppliersForSelect(v, fromdata.supplierId)}
              renderOption={(item) => <>{item.name}</>}
              getOptionValue={(item) => item.id}
              getDisplayValue={(item) => item.name}
              label="Supllayers"
              placeholder="Supllayers"
              value={fromdata.supplierId}
              onChange={(value) => handleChange('supplierId', value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Supping Address</Label>
          <Input
            type="text"
            placeholder="Address"
            value={fromdata.shippingAddress}
            onChange={(e) => handleChange('shippingAddress', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Remark</Label>
          <Input
            type="text"
            placeholder="Remark"
            value={fromdata.remark}
            onChange={(e) => handleChange('remark', e.target.value)}
          />
        </div>

        {reqLOading && (
          <div className="h-28 flex justify-center items-center">
            <Loader className="animate-spin" size={32} />
          </div>
        )}

        {fromdata.products.length > 0 && (
          <>
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
                    {fromdata.products.map((item, index) => (
                      <ProductInput
                        key={`${item.productId}-${index}`}
                        item={item}
                        onChangePrice={(value) =>
                          updateProductPrice(index, value)
                        }
                      />
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={2}>
                        Total Items: {fromdata.products.length}
                      </TableCell>
                      <TableCell colSpan={3} className="text-right">
                        Total Amount:{' '}
                        {fromdata.products
                          .reduce(
                            (acc, item) =>
                              acc + Number(item.quantity) * Number(item.rate),
                            0
                          )
                          .toFixed(2)}{' '}
                        taka
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </div>
          </>
        )}

        <div className="!mt-5">
          {error && <div className="text-red-500  p-2">{error}</div>}
          <Button onClick={hendelSubmit} className="w-full" disabled={loading}>
            Submit Order
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <h1 className="text-center mt-5 w-[90%] text-2xl">
        You can not order without adding Requisition to you organization. Please
        add Reqesition.
      </h1>
      <Button
        className="mt-5"
        variant="outline"
        onClick={() => window.location.reload()}
      >
        Refresh
      </Button>
      <Button className="mt-3" variant="outline" asChild>
        <Link href="/purchase/requisition/add">Add Reqesition</Link>
      </Button>
    </div>
  )
}

export default AddOrder

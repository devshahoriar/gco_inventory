/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/ui/button'
import DateInput from '@/components/ui/DateInput'
import { Input, InputParent } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader } from 'lucide-react'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { getInitialData, getPreRequisition } from './action'

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
  <div className="space-y-2 border p-4 rounded-md">
    <div className="mt-4 grid md:grid-cols-5 sm:grid-cols-2 grid-cols-1 gap-2">
      <InputParent
        labelTitle="Group"
        disabled
        value={item?.groupName || ''}
        className="disabled:opacity-90"
      />
      <InputParent
        labelTitle="Name"
        disabled
        value={item?.productName || ''}
        className="disabled:opacity-90"
      />
      <InputParent
        labelTitle={`Quantity (${item?.unit})`}
        type="number"
        value={item?.quantity || 0}
        disabled
        className="disabled:opacity-90"
      />
      <InputParent
        labelTitle="Rate"
        type="text"
        placeholder="0.00"
        value={item?.rate ?? ''} // Ensure value is never undefined
        onChange={(e) => onChangePrice(e.target.value)}
      />
      <div>
        <Label>Total Ammount</Label>
        <Input
          type="text"
          value={(
            parseFloat(item?.rate || '0') * (item?.quantity || 0)
          ).toFixed(2)}
          disabled
        />
      </div>
    </div>
  </div>
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
  const { data: list, isLoading: inLoading } = useSWR('reqIdNameCount', () =>
    getInitialData()
  )
  const [fromdata, setFormData] = useState<OrderForm>(initialData)

  const { data: regData, isLoading: reqLOading } = useSWR(
    fromdata?.regId ? 'pre' + fromdata.regId : null,
    () => getPreRequisition(fromdata.regId)
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

  const hendelSubmit = () => {
    // if (!fromdata.orderNo || !fromdata.supplierId || !fromdata.warehouseId) {
    //   alert('Please fill all required fields')
    //   return
    // }
    // if (fromdata.products.some((p) => p.price <= 0)) {
    //   alert('Please enter price for all products')
    //   return
    // }
    console.log(fromdata)
    // TODO: Submit order
  }

  return (
    <div className="max-w-4xl mx-auto p-2 space-y-2">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Select Regesition</Label>
          <Select
            disabled={inLoading}
            value={fromdata.regId}
            onValueChange={(value) => {
              setFormData(initialData)
              handleChange('regId', value)
            }}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Select Requisition" />
            </SelectTrigger>
            <SelectContent>
              {list?.regList?.map((req) => (
                <SelectItem value={req.id} key={req.id}>
                  {req.regNumber} · {req._count.reqItems} Items
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Reqesition Date</Label>
          <Input
            type="date"
            onChange={(e) => e.preventDefault()}
            value={fromdata.regDate && new Date()?.toISOString().split('T')[0]}
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label>Order No</Label>
          <Input
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
          <Select
            disabled={inLoading}
            value={fromdata.branchId}
            onValueChange={(value) => handleChange('branchId', value)}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Select Brance" />
            </SelectTrigger>
            <SelectContent>
              {list?.branchList?.map((branch) => (
                <SelectItem value={branch.id} key={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Select Warehouse</Label>
          <Select
            disabled={inLoading}
            value={fromdata.warehouseId}
            onValueChange={(value) => handleChange('warehouseId', value)}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {list?.wareHouseList?.map((ware) => (
                <SelectItem value={ware.id} key={ware.id}>
                  {ware.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Select Supllayers</Label>
          <Select
            disabled={inLoading}
            value={fromdata.supplierId}
            onValueChange={(value) => handleChange('supplierId', value)}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {list?.supliyaerList?.map((sup) => (
                <SelectItem value={sup.id} key={sup.id}>
                  {sup.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            <div className="space-y-3">
              {fromdata.products.map((item, index) => (
                <ProductInput
                  key={`${item.productId}-${index}`}
                  item={item}
                  onChangePrice={(value) => updateProductPrice(index, value)}
                />
              ))}
            </div>
          </div>
          <div>
            <Label>Total</Label>
            <Input
              type="text"
              value={fromdata.products
                .reduce(
                  (acc, item) =>
                    acc + parseFloat(item.rate || '0') * item.quantity,
                  0
                )
                .toFixed(2)}
              disabled
            />
          </div>
        </>
      )}

      <div className="!mt-10">
        <Button onClick={hendelSubmit} className="w-full">
          Submit Order
        </Button>
      </div>
    </div>
  )
}

export default AddOrder

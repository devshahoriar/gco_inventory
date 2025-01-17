/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/ui/button'
import DateInput from '@/components/ui/DateInput'
import { InputParent } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PlusCircle, X } from 'lucide-react'
import { useState } from 'react'
import useSWR from 'swr'
import { getProductForSelect, getProductGroup } from './action'

const ProductInput = ({
  index,
  reqItems,
  updateReqItems,
  removeItem,
}: {
  index: number
  reqItems: Array<{
    productId: string
    quantity: number
    price: number
    groupId: string
    remarks?: string
  }>
  updateReqItems: (items: any[]) => void
  removeItem: (index: number) => void
}) => {
  const [fromData, setFormData] = useState({
    productId: reqItems[index]?.productId || '',
    quantity: reqItems[index]?.quantity || 0,
    price: reqItems[index]?.price || 0,
    groupId: reqItems[index]?.groupId || '',
    remarks: reqItems[index]?.remarks || '',
  })

  const [productUnit, setProductUnit] = useState('')

  const { data: pGroup, isLoading: pl } = useSWR('product_group', () =>
    getProductGroup()
  )

  const {
    data: products,
    isLoading: pLo,
    mutate,
  } = useSWR(fromData?.groupId ? `product+${fromData?.groupId}` : null, () =>
    getProductForSelect(fromData?.groupId)
  )

  const updateItem = (newData: typeof fromData) => {
    setFormData(newData)
    const newItems = [...reqItems]
    newItems[index] = newData
    updateReqItems(newItems)
  }

  return (
    <div className="space-y-2 border p-4 rounded-md relative">
      <Button
        variant="ghost"
        className="absolute top-0 right-0"
        onClick={() => removeItem(index)}
      >
        <X className="size-4" />
      </Button>
      <div className="mt-4 space-y-4">
        <div className="space-y-2">
          <Label>Select Product group</Label>
          <Select
            disabled={pl}
            value={fromData.groupId}
            onValueChange={(v) => {
              updateItem({
                ...fromData,
                groupId: v,
                productId: '',
                quantity: 0,
                price: 0,
              })
              setTimeout(() => mutate(undefined), 0)
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Options" />
            </SelectTrigger>
            <SelectContent>
              {pGroup?.map((group) => (
                <SelectItem value={group.id} key={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {fromData.groupId && (
          <>
            <div className="space-y-2">
              <Label>Select Product</Label>
              <Select
                disabled={pLo}
                value={fromData.productId}
                onValueChange={(v) => {
                  const product = products?.find((p) => p.id === v)
                  if (product) {
                    setProductUnit(product?.productUnit?.name)
                  }
                  updateItem({
                    ...fromData,
                    productId: v,
                    price: 0,
                    quantity: 0,
                  })
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Options" />
                </SelectTrigger>
                <SelectContent>
                  {products?.map((product) => (
                    <SelectItem value={product.id} key={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {fromData.productId && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <InputParent
                    labelTitle={`Quantity (${productUnit})`}
                    type="number"
                    value={fromData.quantity}
                    onChange={(e) =>
                      updateItem({
                        ...fromData,
                        quantity: Number(e.target.value),
                      })
                    }
                  />
                  <InputParent
                    labelTitle="Price"
                    type="number"
                    value={fromData.price}
                    onChange={(e) =>
                      updateItem({ ...fromData, price: Number(e.target.value) })
                    }
                  />
                </div>
                <InputParent
                  labelTitle="Remarks"
                  isTextArea
                  value={fromData.remarks}
                  onChange={(e) =>
                    updateItem({ ...fromData, remarks: e.target.value })
                  }
                  placeholder="Add notes or remark..."
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export const AddRequisition = () => {
  const [prodCount, setProdCount] = useState(0)
  const [formData, setFormData] = useState({
    regNumber: '',
    reqDate: new Date(),
    naration: '',
    reqItems: [] as {
      productId: string
      quantity: number
      price: number
      groupId: string
      remark?: string
    }[],
  })

  const updateReqItems = (items: typeof formData.reqItems) => {
    setFormData((prev) => ({ ...prev, reqItems: items }))
  }

  const removeItem = (index: number) => {
    setProdCount((prev) => prev - 1)
    setFormData((prev) => ({
      ...prev,
      reqItems: prev.reqItems.filter((_, i) => i !== index),
    }))
  }

  const handleAdd = () => {
    // Add your API call or form submission logic here
    console.log(formData)
  }

  const addProduct = () => {
    setProdCount((p) => p + 1)
    setFormData((prev) => ({
      ...prev,
      reqItems: [
        ...prev.reqItems,
        { productId: '', quantity: 0, price: 0, groupId: '' },
      ],
    }))
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="space-y-4">
        <InputParent
          labelTitle="Registration Number"
          id="regNumber"
          placeholder='e.g "REQ-001"'
          value={formData.regNumber}
          onChange={(e) =>
            setFormData({ ...formData, regNumber: e.target.value })
          }
          required
        />

        <div className="space-y-2 flex flex-col gap-2">
          <Label>Requisition Date</Label>
          <DateInput
            value={new Date(formData.reqDate)}
            onChange={(date) => {
              setFormData({ ...formData, reqDate: date ? date : new Date() })
            }}
          />
        </div>

        <InputParent
          labelTitle="Narration"
          isTextArea
          id="naration"
          value={formData.naration}
          onChange={(e) =>
            setFormData({ ...formData, naration: e.target.value })
          }
          placeholder="Add notes or description..."
        />

        {prodCount > 0 && (
          <div className="space-y-3">
            <Label className="flex gap-2 items-center justify-center border-b pb-2 text-xl">
              <span>{prodCount}</span>
              Products
            </Label>
            <div className="space-y-3">
              {[...Array(prodCount)].map((_, i) => (
                <ProductInput
                  key={i}
                  index={i}
                  reqItems={formData.reqItems}
                  updateReqItems={updateReqItems}
                  removeItem={removeItem}
                />
              ))}
            </div>
          </div>
        )}
        <Button type="button" variant="outline" onClick={addProduct}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Product
        </Button>
        <div className="pt-4">
          <Button onClick={handleAdd} className="w-full">
            Submit Requisition
          </Button>
        </div>
      </div>
    </div>
  )
}

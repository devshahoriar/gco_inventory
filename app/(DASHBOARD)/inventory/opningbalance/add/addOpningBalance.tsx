/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { AsyncSelect } from '@/components/ui/async-select'
import { Button } from '@/components/ui/button'
import DateInput from '@/components/ui/DateInput'
import { InputParent } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlusCircle, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { getProductGroup, getProductsForSelect, getWarehouseForSelect, saveOpningBalance } from './action'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const ProductInput = ({
  index,
  items,
  updateItems,
  removeItem,
}: {
  index: number
  items: Array<{
    productId: string
    quantity: number
    rate: number
    remark?: string
    groupId?: string
  }>
  updateItems: (items: any[]) => void
  removeItem: (index: number) => void
}) => {
  const [formData, setFormData] = useState({
    productId: items[index]?.productId || '',
    quantity: items[index]?.quantity || 0,
    rate: items[index]?.rate || 0,
    remark: items[index]?.remark || '',
    groupId: items[index]?.groupId || '',
  })

  const [productUnit, setProductUnit] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('')

  useEffect(() => {
    if (formData.groupId) {
      setSelectedGroup(formData.groupId)
    }
  }, [formData.groupId])

  const updateItem = (newData: typeof formData) => {
    setFormData(newData)
    const newItems = [...items]
    newItems[index] = newData
    updateItems(newItems)
  }

  return (
    <TableRow>
      <TableCell>
        <AsyncSelect
          fetcher={getProductGroup}
          renderOption={(item) => <div>{item.name}</div>}
          getOptionValue={(item) => item.id}
          getDisplayValue={(item) => item.name}
          placeholder="Select Group"
          value={selectedGroup}
          onChange={(v) => {
            updateItem({
              ...formData,
              groupId: v,
              productId: '', // Clear product when group changes
            })
          }}
        />
      </TableCell>
      <TableCell>
        <AsyncSelect
          fetcher={(v?: string) => getProductsForSelect(formData?.groupId, v)}
          renderOption={(item) => <div>{item.name}</div>}
          getOptionValue={(item) => item.id}
          getDisplayValue={(item) => item.name}
          placeholder="Select Product"
          value={formData.productId}
          onChange={(v, options) => {
            const selectedProduct = options?.find((item) => item.id === v)
            setProductUnit(selectedProduct?.productUnit?.unit || '')
            setSelectedGroup(selectedProduct?.productGroupId || '')
            updateItem({
              ...formData,
              productId: v,
              groupId: selectedProduct?.productGroupId || '',
            })
          }}
        />
      </TableCell>
      <TableCell>
        <InputParent
          type="number"
          placeholder={`Quantity ${productUnit ? '(' + productUnit + ')' : ''}`}
          value={formData.quantity}
          onChange={(e) =>
            updateItem({
              ...formData,
              quantity: Number(e.target.value),
            })
          }
        />
      </TableCell>
      <TableCell>
        <InputParent
          type="number"
          placeholder="Rate"
          value={formData.rate}
          onChange={(e) =>
            updateItem({
              ...formData,
              rate: Number(e.target.value),
            })
          }
        />
      </TableCell>
      <TableCell>
        <InputParent
          placeholder="Add remarks..."
          value={formData.remark}
          onChange={(e) => updateItem({ ...formData, remark: e.target.value })}
        />
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeItem(index)}
        >
          <X className="size-4" />
        </Button>
      </TableCell>
      </TableRow>
  )
}

export const AddOpningBalanceForm = () => {
  const [itemCount, setItemCount] = useState(0)
  const [formData, setFormData] = useState({
    warehouseId: '',
    openData: new Date(),
    items: [] as Array<{
      productId: string
      quantity: number
      rate: number
      remark?: string
      groupId?: string
    }>,
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const updateItems = (items: typeof formData.items) => {
    setFormData((prev) => ({ ...prev, items }))
  }

  const handleSubmit = async () => {
    setError('')
    if (!formData.warehouseId) {
      setError('Please select a warehouse')
      return
    }
    if (formData.items.length === 0) {
      setError('Please add at least one product')
      return
    }

    let hasError = false
    formData.items.forEach((item) => {
      if (!item.productId || item.quantity <= 0 || item.rate <= 0) {
        setError('Please fill all product details correctly')
        hasError = true
      }
    })
    if (hasError) return

    try {
      setLoading(true)
      await saveOpningBalance(formData)
      toast.success('Opening balance saved successfully')
      setFormData({
        warehouseId: '',
        openData: new Date(),
        items: [],
      })
      setItemCount(0)
    } catch (error: any) {
      setError(error.message || 'Failed to save opening balance')
    } finally {
      setLoading(false)
    }
  }

  const addProduct = () => {
    setItemCount((p) => p + 1)
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { productId: '', quantity: 0, rate: 0, groupId: '' },
      ],
    }))
  }

  const removeItem = (index: number) => {
    setItemCount((prev) => prev - 1)
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="max-w-4xl mx-auto p-2">
      <div className="space-y-4">
        <div>
          <Label>Warehouse</Label>
          <AsyncSelect
            fetcher={getWarehouseForSelect}
            renderOption={(item) => <div>{item.name}</div>}
            getOptionValue={(item) => item.id}
            getDisplayValue={(item) => item.name}
            placeholder="Select Warehouse"
            value={formData.warehouseId}
            onChange={(v) => setFormData((prev) => ({ ...prev, warehouseId: v }))}
          />
        </div>

        <div className='flex flex-col'>
          <Label>Opening Date</Label>
          <DateInput
            value={formData.openData}
            onChange={(date) => setFormData((prev) => ({ ...prev, openData: date || new Date() }))}
          />
        </div>

        {itemCount > 0 && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Group</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(itemCount)].map((_, i) => (
                  <ProductInput
                    key={i}
                    index={i}
                    items={formData.items}
                    updateItems={updateItems}
                    removeItem={removeItem}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Button 
          type="button" 
          variant="outline" 
          className="!bg-transparent" 
          onClick={addProduct}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Product
        </Button>

        <div>
          <div className="text-red-500 text-sm h-[20px] mb-1">{error}</div>
          <Button 
            onClick={handleSubmit} 
            disabled={loading} 
            className="w-full"
          >
            Save Opening Balance
          </Button>
        </div>
      </div>
    </div>
  )
}

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

type ItemType = {
  productId: string
  quantity: number
  adjustQuantity: number
  remark?: string
  groupId?: string
}

const ProductInput = ({
  index,
  items,
  updateItems,
  removeItem,
}: {
  index: number
  items: ItemType[]
  updateItems: (items: ItemType[]) => void
  removeItem: (index: number) => void
}) => {
  const [formData, setFormData] = useState({
    productId: items[index]?.productId || '',
    quantity: items[index]?.quantity || 0,
    adjustQuantity: items[index]?.adjustQuantity || 0,
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
          renderOption={(item:any) => <div>{item.name}</div>}
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
          renderOption={(item:any) => <div>{item.name}</div>}
          getOptionValue={(item) => item.id}
          getDisplayValue={(item) => item.name}
          placeholder="Select Product"
          value={formData.productId}
          onChange={(v, options) => {
            const selectedProduct = options?.find((item) => item.id === v)
            const currentStock = selectedProduct?.StockItems?.reduce(
              (sum:any, item:any) => sum + item.quantity,
              0
            ) || 0
            
            setProductUnit(selectedProduct?.productUnit?.unit || '')
            setSelectedGroup(selectedProduct?.productGroupId || '')
            updateItem({
              ...formData,
              productId: v,
              groupId: selectedProduct?.productGroupId || '',
              quantity: currentStock,
              adjustQuantity: 0,
            })
          }}
        />
      </TableCell>
      <TableCell>
        <InputParent
          type="number"
          placeholder={`Quantity ${productUnit ? '(' + productUnit + ')' : ''}`}
          value={formData.quantity}
          disabled={true}
        />
      </TableCell>
      <TableCell>
        <InputParent
          type="number"
          placeholder="Adjust Quantity"
          value={formData.adjustQuantity}
          onChange={(e) =>
            updateItem({
              ...formData,
              adjustQuantity: Number(e.target.value),
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
    openDate: new Date(),  // Changed from openData to openDate
    remark: '',  // Add remark field
    items: [] as ItemType[],
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
      if (!item.productId) {
        setError('Please select all products')
        hasError = true
      }
    })
    if (hasError) return

    try {
      setLoading(true)
      await saveOpningBalance({
        warehouseId: formData.warehouseId,
        openDate: formData.openDate,  // Changed from openData to openDate
        items: formData.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          adjustQuantity: item.adjustQuantity,
          remark: item.remark
        }))
      })
      toast.success('Opening balance saved successfully')
      setFormData({
        warehouseId: '',
        openDate: new Date(),  // Changed from openData to openDate
        remark: '',  // Add remark field
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
        {
          productId: '',
          quantity: 0,
          adjustQuantity: 0,
          remark: '',
          groupId: ''
        },
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
            renderOption={(item:any) => <div>{item.name}</div>}
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
            value={formData.openDate}  
            onChange={(date) => setFormData((prev) => ({ ...prev, openDate: date || new Date() }))}  
          />
        </div>

        <div className='flex flex-col'>
          <Label>Remark</Label>
          <InputParent
            placeholder="Add any remarks..."
            value={formData.remark}
            onChange={(e) => setFormData(prev => ({ ...prev, remark: e.target.value }))}
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
                  <TableHead>Adjust Quantity</TableHead>
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

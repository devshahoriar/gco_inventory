/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { AsyncSelect } from '@/components/ui/async-select'
import { Button } from '@/components/ui/button'
import DateInput from '@/components/ui/DateInput'
import { InputParent } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlusCircle, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'
import {
  getProductForSelect,
  getProductGroup,
  getReqesitionNumber,
  saveRequisition,
} from './action'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const ProductInput = ({
  index,
  reqItems,
  updateReqItems,
  removeItem,
}: {
  index: number
  reqItems: Array<{
    productId: string
    quantity: string
    groupId: string
    remarks?: string
  }>
  updateReqItems: (items: any[]) => void
  removeItem: (index: number) => void
}) => {
  const [fromData, setFormData] = useState({
    productId: reqItems[index]?.productId || '',
    quantity: reqItems[index]?.quantity || '0',
    groupId: reqItems[index]?.groupId || '',
    remarks: reqItems[index]?.remarks || '',
  })

  const [productUnit, setProductUnit] = useState('')

  const updateItem = (newData: typeof fromData) => {
    setFormData(newData)
    const newItems = [...reqItems]
    newItems[index] = newData
    updateReqItems(newItems)
  }

  return (
    <TableRow>
      <TableCell>
        <AsyncSelect
          fetcher={(v?: string) => getProductGroup(v, fromData?.groupId)}
          renderOption={(item:any) => <div>{item.name}</div>}
          getOptionValue={(item) => item.id}
          getDisplayValue={(item) => item.name}
          placeholder="Select Group"
          value={fromData.groupId}
          onChange={(v) => {
            updateItem({
              ...fromData,
              groupId: v,
              productId: '',
              quantity: '0',
            })
          }}
        />
      </TableCell>
      <TableCell>
        <AsyncSelect
          fetcher={(v?: string) => getProductForSelect(fromData?.groupId, v)}
          renderOption={(item:any) => <div>{item.name}</div>}
          getOptionValue={(item) => item.id}
          getDisplayValue={(item) => item.name}
          placeholder="Select Product"
          value={fromData.productId}
          onChange={(v, options) => {
            const curentItem = options?.find((item) => item.id === v)
            setProductUnit(curentItem?.productUnit?.unit || '')
            updateItem({
              ...fromData,
              productId: v,
              groupId: curentItem?.productGroupId || '',
              quantity: '0',
            })
          }}
        />
      </TableCell>
      <TableCell>
        <InputParent
          type="number"
          placeholder={`Quantity ${productUnit ? '(' + productUnit + ')' : ''}`}
          value={fromData.quantity}
          onChange={(e) =>
            updateItem({
              ...fromData,
              quantity: e.target.value,
            })
          }
        />
      </TableCell>
      <TableCell>
        <InputParent
          placeholder="Add remarks..."
          value={fromData.remarks}
          onChange={(e) => updateItem({ ...fromData, remarks: e.target.value })}
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

export const AddRequisition = ({
  initialData,
  onSubmit,
}: {
  initialData?: any
  onSubmit?: (data: any) => Promise<void>
}) => {
  const [prodCount, setProdCount] = useState(0)
  const [formData, setFormData] = useState({
    regNumber: initialData?.regNumber || '',
    reqDate: initialData?.reqDate ? new Date(initialData.reqDate) : new Date(),
    naration: initialData?.naration || '',
    reqItems: initialData?.reqItems || [],
  })

 const {mutate} =  useSWR(
    formData?.regNumber ? null : 'regnumber',
    getReqesitionNumber,
    {
      revalidateOnMount: true,
      onSuccess: (data) => {
        setFormData((prev) => ({ ...prev, regNumber: data }))
      },
    }
  )

  useEffect(() => {
    if (initialData?.reqItems) {
      setProdCount(initialData.reqItems.length)
    }
  }, [initialData])

  const updateReqItems = (items: typeof formData.reqItems) => {
    setFormData((prev) => ({ ...prev, reqItems: items }))
  }

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    setError('')
    if (!formData.regNumber) {
      setError('Please fill Requisition number.')
      return
    }
    if (formData.reqItems.length === 0) {
      setError('Please add products to requisition.')
      return
    }
    let error = false
    formData?.reqItems.forEach((item: any) => {
      if (
        !item.groupId ||
        !item.productId ||
        item.quantity === '0' ||
        item.quantity === ''
      ) {
        setError('Please fill all products quantity,group,name details.')
        return (error = true)
      }
    })
    if (error) return

    try {
      setLoading(true)
      if (onSubmit) {
        await onSubmit(formData)
      } else {
        await saveRequisition(formData)
        setFormData({
          regNumber: '',
          reqDate: new Date(),
          naration: '',
          reqItems: [],
        })
        setProdCount(0)
        setError('')
        mutate()
        toast.success('Requisition added successfully')
      }
    } catch (error: Error | any) {
      console.log(error)
      setError(error?.message ? error.message : 'Failed to add requisition')
    } finally {
      setLoading(false)
    }
  }

  const addProduct = () => {
    setProdCount((p) => p + 1)
    setFormData((prev) => ({
      ...prev,
      reqItems: [
        ...prev.reqItems,
        { productId: '', quantity: '0', groupId: '' },
      ],
    }))
  }
  const removeItem = (index: number) => {
    setProdCount((prev) => prev - 1)
    setFormData((prev) => ({
      ...prev,
      reqItems: prev.reqItems.filter((_: any, i: any) => i !== index),
    }))
  }
  return (
    <div className="max-w-4xl mx-auto p-2">
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
              Products
            </Label>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Group</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(prodCount)].map((_, i) => (
                    <ProductInput
                      key={i}
                      index={i}
                      reqItems={formData.reqItems}
                      updateReqItems={updateReqItems}
                      removeItem={removeItem}
                    />
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={5}>
                      Total Items: {prodCount}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>
        )}

        <Button 
          type="button" 
          variant="outline" 
          className='!bg-transparent' 
          onClick={addProduct}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Product
        </Button>

        <div className="!mt-2">
          <div className="text-red-500 text-sm h-[20px] !mb-1">{error}</div>
          <div className="">
            <Button onClick={handleAdd} disabled={loading} className="w-full">
              Submit Requisition
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/ui/button'
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from '@/components/ui/Credenza'
import { InputParent } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { PlusCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import useSWR from 'swr'
import { createProduct, getAllWarehouseByOrganization } from './action'

const initialdata = {
  name: '',

  unit: '',

  description: '',

  productGroupId: '',
}
export const AddProduct = () => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { refresh } = useRouter()
  const [formData, setFormData] = useState(initialdata)
  
  const { data, isLoading } = useSWR(
    () => (open ? 'getAllWarehouseByOrganization' : null),
    getAllWarehouseByOrganization
  )

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string,
    fieldName?: string
  ) => {
    if (typeof e === 'string') {
      setFormData((prev) => ({
        ...prev,
        [fieldName as string]: e,
      }))
    } else {
      const { name, value } = e.target
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      if (!formData.name || !formData.unit) {
        setError('Please fill in all required fields')
        return
      }
      await createProduct(formData)
      refresh()
      setError('')
      setFormData(initialdata)
      setOpen(false)
    } catch (err) {
      console.log(err)
      setError('Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Credenza open={open} onOpenChange={setOpen}>
        <CredenzaTrigger asChild>
          <Button variant="outline">
            Add New Product
            <PlusCircle />
          </Button>
        </CredenzaTrigger>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Add New Product</CredenzaTitle>
            <CredenzaDescription>
              Fill in the product details below
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody className="space-y-4 max-h-[75vh] overflow-y-auto !px-2 pb-1">
            <InputParent
              labelTitle="Product Name"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />

            <div>
              <Label htmlFor="unit">Unit</Label>
              <Select
                name="unit"
                value={formData.unit}
                onValueChange={(value) => handleChange(value, 'unit')}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a unit" />
                </SelectTrigger>
                <SelectContent>
                  {data?.unit?.map((unit: any) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="group">Product Group</Label>
              <Select
                name="productGroupId"
                value={formData.productGroupId}
                onValueChange={(value) => handleChange(value, 'productGroupId')}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a product group" />
                </SelectTrigger>
                <SelectContent>
                  {data?.productGroup?.map((group: any) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Product description"
                rows={3}
              />
            </div>

          
          </CredenzaBody>
          <CredenzaFooter>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button className="mt-3" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Creating...' : 'Create Product'}
            </Button>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </div>
  )
}

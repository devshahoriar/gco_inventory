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
import { Pencil } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import useSWR from 'swr'
import { getAllWarehouseByOrganization, updateProduct } from '../action'

interface EditProductProps {
  product: {
    id: string
    name: string
    description?: string | null
    productUnitId: string
    productGroupId: string
    productUnit: {
      name: string
    }
    ProductGroup: {
      name: string
    }
  }
}

export const EditProduct = ({ product }: EditProductProps) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { refresh } = useRouter()
  const [formData, setFormData] = useState({
    name: product.name,
    unit: product.productUnitId,
    description: product.description || '',
    productGroupId: product.productGroupId,
  })

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
      await updateProduct(product.id, formData)
      refresh()
      setError('')
      setOpen(false)
    } catch (err) {
      console.log(err)
      setError('Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Edit Product</CredenzaTitle>
          <CredenzaDescription>
            Update the product details below
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
            {loading ? 'Updating...' : 'Update Product'}
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  )
}

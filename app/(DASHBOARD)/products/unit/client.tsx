'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Credenza,
  CredenzaTrigger,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaDescription,
  CredenzaBody,
  CredenzaFooter,
} from '@/components/ui/Credenza'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PlusCircle, Pencil } from 'lucide-react'
import { createProductUnit, updateProductUnit } from './action'
import { useRouter } from 'next/navigation'

export const AddUnit = ({organizationId}:{organizationId:string}) => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const {refresh} = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    description: '',
  })
  const [errors, setErrors] = useState({
    name: '',
    unit: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    if (errors[id as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [id]: '' }))
    }
  }

  const handleSubmit = async () => {
    const newErrors = {
      name: !formData.name ? 'Name is required' : '',
      unit: !formData.unit ? 'Unit symbol is required' : '',
    }

    setErrors(newErrors)

    if (newErrors.name || newErrors.unit) {
      return
    }

    setIsLoading(true)
    try {
      await createProductUnit({...formData, organizationId})
      refresh()
      setOpen(false)
      setFormData({ name: '', unit: '', description: '' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <Button variant="outline" disabled={isLoading}>
          Add Unit <PlusCircle />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent className="sm:max-w-[425px]">
        <CredenzaHeader>
          <CredenzaTitle>Add Product Unit</CredenzaTitle>
          <CredenzaDescription>
            Create a new unit of measurement for your products. Fill out the
            details below.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name*</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter unit name"
                className={errors.name ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit Symbol*</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="e.g., kg, pcs, L"
                className={errors.unit ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.unit && (
                <p className="text-sm text-red-500">{errors.unit}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter unit description"
                className="h-20"
                disabled={isLoading}
              />
            </div>
          </div>
        </CredenzaBody>
        <CredenzaFooter>
          <Button type="button" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Unit'}
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  )
}

interface EditUnitProps {
  unit: {
    id: string
    name: string
    unit: string
    description: string | null
  }
}

export const EditUnit = ({ unit }: EditUnitProps) => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { refresh } = useRouter()
  const [formData, setFormData] = useState({
    name: unit.name,
    unit: unit.unit,
    description: unit.description || '',
  })
  const [errors, setErrors] = useState({
    name: '',
    unit: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    if (errors[id as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [id]: '' }))
    }
  }

  const handleSubmit = async () => {
    const newErrors = {
      name: !formData.name ? 'Name is required' : '',
      unit: !formData.unit ? 'Unit symbol is required' : '',
    }

    setErrors(newErrors)

    if (newErrors.name || newErrors.unit) {
      return
    }

    setIsLoading(true)
    try {
      await updateProductUnit(unit.id, formData)
      refresh()
      setOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent className="sm:max-w-[425px]">
        <CredenzaHeader>
          <CredenzaTitle>Edit Product Unit</CredenzaTitle>
          <CredenzaDescription>
            Update the unit of measurement details below.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name*</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter unit name"
                className={errors.name ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit Symbol*</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="e.g., kg, pcs, L"
                className={errors.unit ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.unit && (
                <p className="text-sm text-red-500">{errors.unit}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter unit description"
                className="h-20"
                disabled={isLoading}
              />
            </div>
          </div>
        </CredenzaBody>
        <CredenzaFooter>
          <Button type="button" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Update Unit'}
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  )
}

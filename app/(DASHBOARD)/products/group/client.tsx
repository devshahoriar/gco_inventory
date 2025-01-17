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
import { createProductGroup, updateProductGroup } from './action'
import { useRouter } from 'next/navigation'

export const AddGroup = ({organizationId}:{organizationId:string}) => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const {refresh} = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    group: '',
    description: '',
  })
  const [errors, setErrors] = useState({
    name: '',
    group: '',
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
      group: !formData.group ? 'Group symbol is required' : '',
    }

    setErrors(newErrors)
    if (newErrors.name || newErrors.group) return

    setIsLoading(true)
    try {
      await createProductGroup({...formData, organizationId})
      refresh()
      setOpen(false)
      setFormData({ name: '', group: '', description: '' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <Button variant="outline" disabled={isLoading}>
          Add Group <PlusCircle />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent className="sm:max-w-[425px]">
        <CredenzaHeader>
          <CredenzaTitle>Add Product Group</CredenzaTitle>
          <CredenzaDescription>
            Create a new group for your products. Fill out the details below.
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
                placeholder="Enter group name"
                className={errors.name ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="group">Group Code*</Label>
              <Input
                id="group"
                value={formData.group}
                onChange={handleChange}
                placeholder="Enter group code"
                className={errors.group ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.group && (
                <p className="text-sm text-red-500">{errors.group}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter group description"
                className="h-20"
                disabled={isLoading}
              />
            </div>
          </div>
        </CredenzaBody>
        <CredenzaFooter>
          <Button type="button" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Group'}
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  )
}

interface EditGroupProps {
  group: {
    id: string
    name: string
    group: string
    description: string | null
  }
}

export const EditGroup = ({ group }: EditGroupProps) => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { refresh } = useRouter()
  const [formData, setFormData] = useState({
    name: group.name,
    group: group.group,
    description: group.description || '',
  })
  const [errors, setErrors] = useState({
    name: '',
    group: '',
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
      group: !formData.group ? 'Group code is required' : '',
    }

    setErrors(newErrors)
    if (newErrors.name || newErrors.group) return

    setIsLoading(true)
    try {
      await updateProductGroup(group.id, formData)
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
          <CredenzaTitle>Edit Product Group</CredenzaTitle>
          <CredenzaDescription>
            Update the product group details below.
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
                placeholder="Enter group name"
                className={errors.name ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="group">Group Code*</Label>
              <Input
                id="group"
                value={formData.group}
                onChange={handleChange}
                placeholder="Enter group code"
                className={errors.group ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.group && (
                <p className="text-sm text-red-500">{errors.group}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter group description"
                className="h-20"
                disabled={isLoading}
              />
            </div>
          </div>
        </CredenzaBody>
        <CredenzaFooter>
          <Button type="button" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Update Group'}
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  )
}

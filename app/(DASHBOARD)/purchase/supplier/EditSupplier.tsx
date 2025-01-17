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
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Pen } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { updateSupplier } from './action'

interface SupplierFormData {
  id: string
  code: string
  name: string
  address: string | null
  phone: string | null
  email: string | null
  note: string | null
  status: boolean
}

export default function EditSupplier({ supplier }: { supplier: SupplierFormData }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { refresh } = useRouter()
  const [formData, setFormData] = useState<SupplierFormData>(supplier)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleStatusChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      status: checked,
    }))
  }

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.address || !formData.phone) {
        setError('Please fill in name, address, and phone fields')
        return
      }
      setLoading(true)
      await updateSupplier(formData.id, formData)
      refresh()
      setOpen(false)
      setLoading(false)
      setError('')
    } catch (error) {
      console.error('Error updating supplier:', error)
      setError('Error updating supplier')
    }
  }

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <Button variant="outline" size="sm">
          <Pen/>
        </Button>
      </CredenzaTrigger>
      <CredenzaContent className="sm:max-w-[425px]">
        <CredenzaHeader>
          <CredenzaTitle>Edit Supplier</CredenzaTitle>
          <CredenzaDescription>{ ' '}</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="space-y-4">
          <InputParent
            labelTitle="Code"
            name="code"
            placeholder="Enter supplier code"
            value={formData.code}
            onChange={handleChange}
          />
          <InputParent
            labelTitle="Name"
            name="name"
            placeholder="Enter supplier name"
            value={formData.name}
            onChange={handleChange}
          />
          <div className="space-y-1">
            <label htmlFor="address">Address</label>
            <Textarea
              id="address"
              name="address"
              placeholder="Enter supplier address"
              value={formData.address || ''}
              onChange={handleChange}
            />
          </div>
          <InputParent
            labelTitle="Phone"
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone || ''}
            onChange={handleChange}
          />
          <InputParent
            labelTitle="Email"
            name="email"
            placeholder="Enter email address"
            value={formData.email || ''}
            onChange={handleChange}
          />
          <div className="space-y-1">
            <label htmlFor="note">Note</label>
            <Textarea
              id="note"
              name="note"
              placeholder="Enter note"
              value={formData.note || ''}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="status"
              checked={formData.status}
              onCheckedChange={handleStatusChange}
            />
            <Label htmlFor="status">Active</Label>
          </div>
        </CredenzaBody>
        <CredenzaFooter>
          {error && <p className="text-red-500">{error}</p>}
          <Button disabled={loading} onClick={handleSubmit}>Update Supplier</Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  )
}

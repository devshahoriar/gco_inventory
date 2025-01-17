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
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createSupplier } from './action'

interface SupplierFormData {
  code: string
  name: string
  address: string
  phone: string
  email: string
  note: string
  orgId: string
}

export default function AddNewSupplier({ orgId }: { orgId: string }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { refresh } = useRouter()
  const [formData, setFormData] = useState<SupplierFormData>({
    code: '',
    name: '',
    address: '',
    phone: '',
    email: '',
    note: '',
    orgId: orgId,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.address || !formData.phone) {
        setError('Please name, address, phone the fields')
        return
      }
      setLoading(true)
      await createSupplier(formData)
      refresh()
      setOpen(false)
      setLoading(false)
      setFormData({
        code: '',
        name: '',
        address: '',
        phone: '',
        email: '',
        note: '',
        orgId: orgId,
      })
      setError('')
    } catch (error) {
      console.error('Error adding supplier:', error)
      setError('Error adding supplier')
    }
  }

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <Button variant="outline">Add New Supplier</Button>
      </CredenzaTrigger>
      <CredenzaContent className="sm:max-w-[425px]">
        <CredenzaHeader>
          <CredenzaTitle>Add New Supplier</CredenzaTitle>
          <CredenzaDescription> </CredenzaDescription>
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
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <InputParent
            labelTitle="Phone"
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
          />
          <InputParent
            labelTitle="Email"
            name="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={handleChange}
          />
          <div className="space-y-1">
            <label htmlFor="note">Note</label>
            <Textarea
              id="note"
              name="note"
              placeholder="Enter note"
              value={formData.note}
              onChange={handleChange}
            />
          </div>
        </CredenzaBody>
        <CredenzaFooter>
          {error && <p className="text-red-500">{error}</p>}
          <Button disabled={loading} onClick={handleSubmit}>
            Save Supplier
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  )
}

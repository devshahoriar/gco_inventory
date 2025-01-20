/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/ui/button'
import { InputParent } from '@/components/ui/input'
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTrigger,
  CredenzaTitle,
} from '@/components/ui/Credenza'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { editBranch } from './action'
import { useRouter } from 'next/navigation'

type Branch = {
  id: string
  name: string
  description: string | null
  address: string
}

export const EditBranch = ({ branch }: { branch: Branch }) => {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: branch.name,
    description: branch.description || '',
    address: branch.address,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { refresh } = useRouter()

  const handleSubmit = async () => {
    setError('')
    if (!formData.name || !formData.address) {
      setError('Please fill name and address fields')
      return
    }
    try {
      setLoading(true)
      await editBranch(branch.id, formData)
      refresh()
      setLoading(false)
      setOpen(false)
    } catch (error: any) {
      setLoading(false)
      setError(error?.message || 'Something went wrong')
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="w-4 h-4" />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Edit Branch</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody>
          <div className="space-y-4">
            <InputParent
              labelTitle="Branch Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter branch name"
              required
            />
            <InputParent
              labelTitle="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter branch address"
              isTextArea
              required
            />
            <InputParent
              labelTitle="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter branch description"
              isTextArea
            />
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button variant="outline">Cancel</Button>
          </CredenzaClose>
          <Button disabled={loading} onClick={handleSubmit}>
            Update Branch
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  )
}

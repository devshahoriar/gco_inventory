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
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { addBranch } from './action'
import { useRouter } from 'next/navigation'

export const AddBranch = () => {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { refresh } = useRouter()

  const handleSubmit = async () => {
    setError('')
    if (
      !formData.name ||
      !formData.address ||
      formData.name === '' ||
      formData.address === ''
    ) {
      setError('Please name, address fields')
      return
    }
    try {
      setLoading(true)
      await addBranch(formData)
      refresh()
      setLoading(false)
      setOpen(false)
      setFormData({
        name: '',
        description: '',
        address: '',
      })
    } catch (error: any) {
      setLoading(false)
      if (error?.message) {
        setError(error.message)
      }
      setError('Something went wrong')
      console.log(error)
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
        <Button variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add Branch
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Add New Branch</CredenzaTitle>
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
            Save Branch
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  )
}

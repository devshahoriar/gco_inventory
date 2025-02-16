/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Pencil, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { updateCustomer } from './action'

export default function EditCustomer({ customer }: { customer: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const form = e.currentTarget as HTMLFormElement
      const formData = new FormData(form)
      const customerData = {
        name: formData.get('name'),
        customersType: formData.get('customersType'),
        address: formData.get('address'),
        mobile: formData.get('mobile'),
        email: formData.get('email'),
        note: formData.get('note'),
        status: formData.get('status'),
      }

      await updateCustomer(customer.id, customerData)
      toast.success('Customer updated successfully')
      setIsOpen(false)
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to update customer'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <form onSubmit={handleSubmit}>
          <CredenzaHeader>
            <CredenzaTitle>Edit Customer</CredenzaTitle>
            <CredenzaDescription>
              Update customer information.
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input 
                  name="name" 
                  defaultValue={customer.name}
                  required 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Customer Type</label>
                <Select name="customersType" defaultValue={customer.customersType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Accounts Receivable">
                      Accounts Receivable
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Customer Number</label>
                <Input
                  name="customerNumber"
                  defaultValue={customer.customerNumber}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <Input 
                  name="address" 
                  defaultValue={customer.address}
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mobile</label>
                  <Input
                    name="mobile"
                    defaultValue={customer.mobile}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input 
                    name="email" 
                    type="email" 
                    defaultValue={customer.email}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Note</label>
                <Textarea
                  name="note"
                  defaultValue={customer.note}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select 
                  name="status" 
                  defaultValue={customer.status ? 'true' : 'false'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CredenzaBody>
          <CredenzaFooter>
            <Button type="submit" disabled={loading} className="w-full mt-3">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Customer
            </Button>
          </CredenzaFooter>
        </form>
      </CredenzaContent>
    </Credenza>
  )
}

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
import { PlusCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { addCustomer, getCustomerNumber } from './action'
import useSWR from 'swr'

export default function NewCustomer() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { data, mutate } = useSWR(
    isOpen ? 'customerNumber' : null,
    getCustomerNumber,
    {
      revalidateOnMount: true,
    }
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const form = e.currentTarget as HTMLFormElement
      const formData = new FormData(form)
      const customer = {
        name: formData.get('name'),
        customersType: formData.get('customersType'),
        customerNumber: formData.get('customerNumber'),
        address: formData.get('address'),
        mobile: formData.get('mobile'),
        email: formData.get('email'),
        note: formData.get('note'),
        status: formData.get('status'),
      }

      await addCustomer(customer)
      toast.success('Customer created successfully')
      setIsOpen(false)
      router.refresh()
      mutate()
      form.reset()
    } catch (error) {
      console.error(error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to create customer'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger asChild>
        <Button variant="outline">
          Add New Customer <PlusCircle className="ml-2 h-4 w-4" />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <form onSubmit={handleSubmit}>
          <CredenzaHeader>
            <CredenzaTitle>Add New Customer</CredenzaTitle>
            <CredenzaDescription>
              Add a new customer to your organization.
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input name="name" placeholder="Enter customer name" required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Customer Type</label>
                <Select name="customersType" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={'Accounts Receivable'}>
                      Accounts Receivable
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Customer Number</label>
                <Input
                  name="customerNumber"
                  placeholder="Enter customer number"
                  required
                  defaultValue={data}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <Input name="address" placeholder="Enter address" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mobile</label>
                  <Input
                    name="mobile"
                    placeholder="Enter mobile number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input name="email" type="email" placeholder="Enter email" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Note</label>
                <Textarea
                  name="note"
                  placeholder="Enter additional notes"
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select name="status" defaultValue="true" required>
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
              Create Customer
            </Button>
          </CredenzaFooter>
        </form>
      </CredenzaContent>
    </Credenza>
  )
}

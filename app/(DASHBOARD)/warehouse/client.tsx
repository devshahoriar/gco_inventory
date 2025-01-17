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
} from "@/components/ui/Credenza"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PlusCircle, Loader2 } from 'lucide-react'
import { addNewWarehouse } from './action'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export const NewWareHouse = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const form = e.currentTarget as HTMLFormElement
      const formData = new FormData(form)
      await addNewWarehouse(formData)
      toast.success('Warehouse created successfully')
      setIsOpen(false)
      router.refresh()
      form.reset()
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : 'Failed to create warehouse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger asChild>
        <Button variant="outline">
          Add New <PlusCircle className="ml-2 h-4 w-4"/>
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <form onSubmit={handleSubmit}>
          <CredenzaHeader>
            <CredenzaTitle>Add New Warehouse</CredenzaTitle>
            <CredenzaDescription>
              Add a new warehouse to manage your inventory in different locations.
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input name="name" placeholder="Enter warehouse name" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <Input name="address" placeholder="Enter warehouse address" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  name="description" 
                  placeholder="Enter warehouse description"
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </CredenzaBody>
          <CredenzaFooter>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full mt-3"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Warehouse
            </Button>
          </CredenzaFooter>
        </form>
      </CredenzaContent>
    </Credenza>
  )
}
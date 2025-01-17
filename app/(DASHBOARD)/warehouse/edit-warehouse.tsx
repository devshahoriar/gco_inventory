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
import { Loader2, Pencil } from 'lucide-react'
import { updateWarehouse } from './action'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface EditWarehouseProps {
  warehouse: {
    id: string
    name: string
    address: string
    description: string | null
  }
}

export const EditWarehouse = ({ warehouse }: EditWarehouseProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const form = e.currentTarget as HTMLFormElement
      const formData = new FormData(form)
      await updateWarehouse(warehouse.id, formData)
      toast.success('Warehouse updated successfully')
      setIsOpen(false)
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : 'Failed to update warehouse')
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
            <CredenzaTitle>Edit Warehouse</CredenzaTitle>
            <CredenzaDescription>
              Make changes to your warehouse information.
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input 
                  name="name" 
                  defaultValue={warehouse.name}
                  placeholder="Enter warehouse name" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <Input 
                  name="address" 
                  defaultValue={warehouse.address}
                  placeholder="Enter warehouse address" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  name="description" 
                  defaultValue={warehouse.description || ''}
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
              Save Changes
            </Button>
          </CredenzaFooter>
        </form>
      </CredenzaContent>
    </Credenza>
  )
}

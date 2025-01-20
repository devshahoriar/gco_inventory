'use client'

import DateInput from '@/components/ui/DateInput'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const AddOrder = () => {
  return (
    <div className="max-w-4xl mx-auto p-2">
      <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
        <div className="space-y-2">
          <Label>Select Regesition</Label>
          <Select>
            <SelectTrigger className="">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Reqesition Date</Label>
          <Input type="date" disabled />
        </div>

        <div className="space-y-2">
          <Label>Order No</Label>
          <Input type="text" placeholder="eng: order-1" />
        </div>
        <div className="space-y-2">
          <Label>Order Date</Label>
          <DateInput className="block w-full" />
        </div>
      </div>
    </div>
  )
}

export default AddOrder

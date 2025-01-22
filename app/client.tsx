/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { organization } from '@/lib/authClient'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import slugify from 'slugify'
import { toast } from 'sonner'
import { setActiveOrg } from './action'

export function NewOrganization() {
  const [title, setTitle] = useState('')
  const [open, setOpen] = useState(false)
  const { refresh } = useRouter()
  const [loading, setLoading] = useState(false)
  const hendelSubmit = async () => {
    setLoading(true)
    const slug = slugify(title, { lower: true })
    const x = await organization.create({ name: title, slug })
    if (!x?.error) {
      await setActiveOrg(x?.data?.id as string)
      setOpen(false)
      refresh()
      setLoading(false)
      setTitle('')
    } else {
      toast.error(x?.error?.message)
      setLoading(false)
    }
  }
  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <Button variant="outline" className="w-full flex items-center gap-2">
          <span className="hidden md:block">Add Organization</span>
          <Plus size={13} />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>New Organization</CredenzaTitle>
          <CredenzaDescription> </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <InputParent
            labelTitle="Organization Name"
            type="text"
            placeholder="Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </CredenzaBody>
        <CredenzaFooter>
          <Button disabled={loading} variant="outline" onClick={hendelSubmit}>
            Create
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  )
}

export function SelectOrg({ listOrganization, active }: any) {
  const { refresh } = useRouter()
  const hendelChange = async (e: any) => {
    await organization.setActive({
      organizationId: e,
      fetchOptions: {
        credentials: 'include',
      },
    })
    await setActiveOrg(e)
    refresh()
  }
  return (
    <Select onValueChange={hendelChange} defaultValue={active}>
      <SelectTrigger className="w-full md:w-36">
        <SelectValue placeholder="Select Organization" />
      </SelectTrigger>
      <SelectContent>
        {listOrganization.map((org: any) => (
          <SelectItem key={org.id} value={org.id}>
            {org.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

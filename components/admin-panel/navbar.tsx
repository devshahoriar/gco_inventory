import { SelectOrg } from '@/app/client'
import { SheetMenu } from '@/components/admin-panel/sheet-menu'
import { UserNav } from '@/components/admin-panel/user-nav'
import { getUser } from '@/lib/auth'
import prisma from '@/prisma/db'
import { unstable_cache } from 'next/cache'
import { headers } from 'next/headers'

interface NavbarProps {
  title: string
}

const getOrg = unstable_cache(async (id: string) => {
  return prisma.organization.findMany({
    where: {
      members: {
        some: {
          userId: id,
        },
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  })
})

export async function Navbar({ title }: NavbarProps) {
  const user = await getUser(headers)
  const listOrganization = await getOrg(user?.id as string)
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-2 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 className="font-bold">{title}</h1>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2">
          {listOrganization.length > 0 && (
            <div>
              <SelectOrg
                active={user?.activeOrganizationId}
                listOrganization={listOrganization}
              />
            </div>
          )}
          <UserNav />
        </div>
      </div>
    </header>
  )
}

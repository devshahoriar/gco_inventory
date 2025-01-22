import SingOutButton from '@/components/shared/SingOutButton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getUser } from '@/lib/auth'
import prisma from '@/prisma/db'
import {
  AlertCircle,
  AppWindow,
  BarChart3,
  LogOutIcon,
  Package,
  Users,
} from 'lucide-react'
import { headers } from 'next/headers'
import Link from 'next/link'
import { NewOrganization, SelectOrg } from './client'
import NoOrg from './noorg.svg'
import Image from 'next/image'

export default async function Home() {
  const user = await getUser(headers)

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-[90%] max-w-md p-6 text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Welcome to Inventory Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-muted-foreground">
              Please sign in to access the system
            </p>
            <Link href="/join">
              <Button size="lg" className="w-full">
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const listOrganization = await prisma.organization.findMany({
    where: {
      members: {
        some: {
          userId: user?.id,
        },
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex  justify-between items-center md:items-center gap-2 ">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.name}</p>
          </div>
          <div>
            <NewOrganization />
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.image || ''} alt={user.name || 'User'} />
                <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem>
              <Link
                href="/dashboard"
                className="w-full flex items-center gap-2"
              >
                Dashboard <AppWindow size={12} />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SingOutButton asChild>
                <button className="w-full text-left text-red-600 flex items-center gap-2">
                  Sign Out
                  <LogOutIcon size={12} />
                </button>
              </SingOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>
        <Card>
          <CardContent className="pt-6 ">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user.image || ''}
                    alt={user.name || 'User'}
                  />
                  <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>

                <div className="text-sm">
                  <p className="font-bold">{user.name}</p>
                  <p className="font-medium">{user.role}</p>
                  <p className="text-muted-foreground">{user.email}</p>
                  <p className="text-muted-foreground">
                    You have {listOrganization.length} organizations
                  </p>
                </div>
              </div>
              {listOrganization.length > 0 && (
                <div>
                  <SelectOrg
                    active={user?.activeOrganizationId}
                    listOrganization={listOrganization}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {user?.activeOrganizationId ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+12 this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Low Stock Items
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$52,234</div>
              <p className="text-xs text-muted-foreground">
                Current inventory value
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">
                Across organization
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className='pt-6 flex items-center justify-center flex-col'>
            <h1 className="text-2xl font-bold text-center uppercase">no organization</h1>
            <p className='text-center text-red-500 mt-3'>Create a organization</p>
            <Image  src={NoOrg} alt="s" className='mt-6' />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

'use server'

import { getUser } from '@/lib/auth'
import prisma from '@/prisma/db'
import { headers } from 'next/headers'

export async function getWarehouses() {
  const user = await getUser(headers)

  if (!user) {
    throw new Error('User not found')
  }

  return await prisma.warehouse.findMany({
    where: {
      organizationId: user.activeOrganizationId as string,
    },
    orderBy: {
      name: 'asc',
    },
    omit: {
      organizationId: true,
    },
    include: {
      _count: {
        select: {
          Purchase: true,
        },
      },
    },
  })
}

export const addNewWarehouse = async (formData: FormData) => {
  const name = formData.get('name') as string
  const address = formData.get('address') as string
  const description = formData.get('description') as string
  const user = await getUser(headers)

  if (!user) {
    throw new Error('User not found')
  }

  await prisma.warehouse.create({
    data: {
      name,
      address,
      description,
      organizationId: user?.activeOrganizationId as string,
    },
    select: {
      id: true,
    },
  })

  return {
    success: true,
  }
}

export const updateWarehouse = async (id: string, formData: FormData) => {
  const name = formData.get('name') as string
  const address = formData.get('address') as string
  const description = formData.get('description') as string
  const user = await getUser(headers)

  if (!user) {
    throw new Error('User not found')
  }

  await prisma.warehouse.update({
    where: { id },
    data: {
      name,
      address,
      description,
    },
  })

  return {
    success: true,
  }
}

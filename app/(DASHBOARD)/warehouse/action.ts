'use server'

import { getActiveOrg } from '@/lib/auth'
import prisma from '@/prisma/db'

export async function getWarehouses() {
  const orgId = await getActiveOrg()

  return await prisma.warehouse.findMany({
    where: {
      organizationId: orgId,
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
  const orgId = await getActiveOrg()

  await prisma.warehouse.create({
    data: {
      name,
      address,
      description,
      organizationId: orgId,
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

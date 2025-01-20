/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { getUser } from '@/lib/auth'
import prisma from '@/prisma/db'
import { headers } from 'next/headers'

export const getAllBranch = async () => {
  const user = await getUser(headers)
  return await prisma.branch.findMany({
    where: {
      organizationId: user?.activeOrganizationId,
    },
    select: {
      address: true,
      createdAt: true,
      description: true,
      id: true,
      name: true,
    },
  })
}

export const addBranch = async (data: any) => {
  const user = (await getUser(headers)) as any
  return await prisma.branch.create({
    data: {
      address: data.address,
      description: data.description,
      name: data.name,
      organizationId: user?.activeOrganizationId,
      creatorId: user?.id,
    },
    select: {
      id: true,
    },
  })
}

export const editBranch = async (id: string, data: any) => {
  const user = (await getUser(headers)) as any
  return await prisma.branch.update({
    where: {
      id,
      organizationId: user?.activeOrganizationId,
    },
    data: {
      address: data.address,
      description: data.description,
      name: data.name,
    },
  })
}

export const deleteBranch = async (id: string) => {
  const user = (await getUser(headers)) as any
  return await prisma.branch.delete({
    where: {
      id,
      organizationId: user?.activeOrganizationId,
    },
  })
}

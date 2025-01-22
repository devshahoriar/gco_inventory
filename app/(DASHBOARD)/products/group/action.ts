/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'
import prisma from '@/prisma/db'
import { revalidateTag, unstable_cache } from 'next/cache'

export const getProductGroupByOrgId = unstable_cache(
  async (orgId: string) => {
    return prisma.productGroup.findMany({
      where: {
        organizationId: orgId,
      },
      omit: {
        organizationId: true,
      },
    })
  },
  undefined,
  {
    tags: ['productGroup'],
  }
)

export const createProductGroup = async (data: any) => {
  revalidateTag('productGroup')
  await prisma.productGroup.create({
    data: {
      name: data.name,
      group: data.group,
      description: data.description,
      organizationId: data.organizationId,
    },
  })
}

export const updateProductGroup = async (id: string, data: any) => {
  revalidateTag('productGroup')
  await prisma.productGroup.update({
    where: { id },
    data: {
      name: data.name,
      group: data.group,
      description: data.description,
    },
  })
}

/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'
import prisma from '@/prisma/db'
import { revalidateTag, unstable_cache } from 'next/cache'

export const getProductUnitByOrgId = unstable_cache(
  async (orgId: string) => {
    return prisma.productUnit.findMany({
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
    tags: ['productUnit'],
  }
)

export const createProductUnit = async (data: any) => {
  revalidateTag('productUnit')
  await prisma.productUnit.create({
    data: {
      name: data.name,
      unit: data.unit,
      description: data.description,
      organizationId: data.organizationId,
    },
  })
}

export const updateProductUnit = async (id: string, data: any) => {
  revalidateTag('productUnit')
  await prisma.productUnit.update({
    where: { id },
    data: {
      name: data.name,
      unit: data.unit,
      description: data.description,
    },
  })
}

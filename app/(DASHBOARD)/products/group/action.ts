/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'
import { PRODUCT_GROUP_TAG } from '@/lib/constant'
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
    tags: [PRODUCT_GROUP_TAG],
  }
)

export const createProductGroup = async (data: any) => {
  revalidateTag(PRODUCT_GROUP_TAG)
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
  revalidateTag(PRODUCT_GROUP_TAG)
  await prisma.productGroup.update({
    where: { id },
    data: {
      name: data.name,
      group: data.group,
      description: data.description,
    },
  })
}

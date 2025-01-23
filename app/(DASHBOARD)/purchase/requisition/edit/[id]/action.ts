/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { REQUISITION_TAG } from '@/lib/constant'
import prisma from '@/prisma/db'
import { revalidateTag, unstable_cache } from 'next/cache'


export const getRequisition = unstable_cache(
  async (id: string, orgId: string) => {
    return prisma.requisition.findFirst({
      where: {
        id,
        organizationId: orgId,
      },
      include: {
        reqItems: {
          include: {
            product: {
              include: {
                productUnit: true,
              },
            },
          },
        },
      },
    })
  },
  undefined,
  {
    tags: [REQUISITION_TAG],
  }
)

export const updateRequisition = async (id: string, data: any) => {
  revalidateTag(REQUISITION_TAG)
  try {
    return await prisma.$transaction(async (tx) => {
      const requisition = await tx.requisition.update({
        where: { id },
        data: {
          regNumber: data.regNumber,
          reqDate: data.reqDate,
          naration: data.naration,
        },
      })

      await tx.reqItems.deleteMany({
        where: { requisitionId: id },
      })

      const reqItems = await tx.reqItems.createMany({
        data: data.reqItems.map((item: any) => ({
          requisitionId: id,
          productId: item.productId,
          quantity: parseInt(item.quantity),
          remark: item?.remark || null,
          groupId: item?.groupId,
        })),
      })

      return { requisition, itemsCreated: reqItems.count }
    })
  } catch (error) {
    console.log(error)
    throw new Error('Server error.')
  }
}

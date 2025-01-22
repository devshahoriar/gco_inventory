/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { getActiveOrg } from '@/lib/auth'
import prisma from '@/prisma/db'

export const getRequisition = async (id: string) => {
  const orgId = await getActiveOrg()
  return await prisma.requisition.findFirst({
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
}

export const updateRequisition = async (id: string, data: any) => {
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

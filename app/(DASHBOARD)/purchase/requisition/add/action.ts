/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
'use server'

import { getUser } from '@/lib/auth'
import prisma from '@/prisma/db'
import { headers } from 'next/headers'

export const getProductGroup = async () => {
  const user = await getUser(headers)
  return await prisma.productGroup.findMany({
    where: {
      organizationId: user?.activeOrganizationId,
    },
    omit: {
      description: true,
      organizationId: true,
      group: true,
    },
  })
}

export const getProductForSelect = async (guId: string) => {
  console.log(guId)
  const user = await getUser(headers)
  return await prisma.product.findMany({
    where: {
      productGroupId: guId,
      organizationId: user?.activeOrganizationId,
    },
    select: {
      id: true,
      name: true,
      productUnit: {
        select: {
          id: true,
          name: true,
          unit: true,
        },
      },
    },
  })
}

type DATA =  {
  regNumber: string;
  reqDate: Date;
  naration: string;
  reqItems: {
      productId: string;
      quantity: string;
      groupId: string;
      remark?: string;
  }[];
}

export const saveRequisition = async (data: DATA) => {
  try {
    const user = await getUser(headers) 
    
    return await prisma.$transaction(async (tx) => {
      // Create requisition header
      const requisition = await tx.requisition.create({
        data: {
          regNumber: data.regNumber,
          reqDate: data.reqDate,
          naration: data.naration,
          organizationId: user?.activeOrganizationId!,
          creatorId: user?.id!,
        }
      })

      // Create requisition items
      const reqItems = await tx.reqItems.createMany({
        data: data.reqItems.map(item => ({
          requisitionId: requisition.id,
          productId: item.productId,
          quantity: parseInt(item.quantity),
          remark: item?.remark || null,
          groupId: item?.groupId,
        }))
      })

      return { requisition, itemsCreated: reqItems.count }
    })
    
  } catch (error) {
    console.log(error)
    throw new Error('Server error.')
  }
}

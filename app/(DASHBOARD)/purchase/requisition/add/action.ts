/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
'use server'

import { getUser } from '@/lib/auth'
import prisma from '@/prisma/db'
import { headers } from 'next/headers'

export const getProductGroup = async (text?: string,id?:string) => {
  const user = await getUser(headers)
  const whereFilter = {
    organizationId: user?.activeOrganizationId,
    ...(text ? { name: { contains: text } } : {}),
    ...(id ? { id: id } : {}),
  }

  return await prisma.productGroup.findMany({
    where: whereFilter,
    take: 20,
    omit: {
      description: true,
      organizationId: true,
      group: true,
    },
  })
}

export const getProductForSelect = async (guId?: string, v?: string) => {
  const user = await getUser(headers)
  return await prisma.product.findMany({
    where: {
      ...(guId ? { productGroupId: guId } : {}),
      ...(v ? { name: { contains: v ,} } : {}),
      organizationId: user?.activeOrganizationId,
    },
    select: {
      id: true,
      name: true,
      productGroupId: true,
      productUnit: {
        select: {
          unit: true,
        },
      },
    },
  })
}

type DATA = {
  regNumber: string
  reqDate: Date
  naration: string
  reqItems: {
    productId: string
    quantity: string
    groupId: string
    remark?: string
  }[]
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
        },
      })

      // Create requisition items
      const reqItems = await tx.reqItems.createMany({
        data: data.reqItems.map((item) => ({
          requisitionId: requisition.id,
          productId: item.productId,
          quantity: parseInt(item.quantity),
          remark: item?.remark || null,
          groupId: item?.groupId,
        })),
      })

      return { requisition, itemsCreated: reqItems.count }
    })
  } catch (error: any) {
    console.log(error)
    if (error.code === 'P2002') {
      throw new Error('Requisition number already exists.')
    }
    throw new Error('Server error.')
  }
}

export const getReqesitionNumber = async () => {
  const user = await getUser(headers)
  const regC = await prisma.requisition.count({
    where: {
      organizationId: user?.activeOrganizationId,
    },
  })
  return `REQ-${regC + 1}`
}

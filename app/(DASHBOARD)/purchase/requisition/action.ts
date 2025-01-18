'use server'

import prisma from '@/prisma/db'

export const countReq = async (orgId: string) => {
  return await prisma.requisition.count({
    where: {
      organizationId: orgId,
    },
  })
}

export const getAllReq = async (orgId: string) => {
  return await prisma.requisition.findMany({
    where: {
      organizationId: orgId,
    },
    select: {
      id: true,
      createdAt: true,
      naration: true,
      regNumber: true,
      reqDate: true,
      creator: {
        select: {
          name: true,
        },
      },
      reqItems: {
        select: {
          id: true,
          productId: true,
          product: {
            select: {
              name: true,
            },
          },
          quantity: true,
          groupId: true,
          group: {
            select: {
              name: true,
            },
          },
          remark: true,
        },
      },
      updatedAt: true,
    },
  })
}

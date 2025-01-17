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
      reqItems: true,
      updatedAt: true,
    },
  })
}

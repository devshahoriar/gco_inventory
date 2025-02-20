'use server'

import prisma from '@/prisma/db'

export const getAllSalesChallan = async (orgId: string) => {
  return prisma.sealsChallan.findMany({
    where: {
      orgId: orgId,
    },
    include: {
      Branch: true,
      Warehouse: true,
      Customers: true,
      sealsChallanItems: {
        include: {
          product: true,
        },
      },
      SealsOrder: true,
    },
  })
}
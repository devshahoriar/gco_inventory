'use server'

import prisma from '@/prisma/db'

export const getAllStockItems = async (orgId: string) => {
  return await prisma.stockItems.findMany({
    where: {
      orgId: orgId,
    },
    select: {
      id: true,
      batch: true,
      invoice: {
        select: {
          invoiceNo: true,
        },
      },
      branch: {
        select: {
          name: true,
        },
      },
      description: true,
      discount: true,
      rate: true,
      warehouse: {
        select: {
          name: true,
        },
      },
      product: {
        select: {
          name: true,
          id: true,
          productUnit: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })
}

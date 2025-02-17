'use server'

import prisma from '@/prisma/db'

export const getAllSalesOrders = async (orgId: string) => {
  return prisma.sealsOrder.findMany({
    where: {
      orgId: orgId,
    },
    include: {
      Branch: true,
      Warehouse: true,
      Customers: true,
      SealsProduct: {
        include: {
          product: true,
        },
      },
    },
  })
}

/* eslint-disable @typescript-eslint/no-explicit-any */

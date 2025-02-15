'use server'

import prisma from '@/prisma/db'


export const getAllOrder =
  async (orgId: string) => {
    return prisma.order.findMany({
      where: {
        orgId: orgId,
      },
      select: {
        id: true,
        orderNo: true,
        orderDate: true,
        dueDate: true,
        supingAddress: true,
        Branch: true,
        isChalaned: true,
        Warehouse: true,
        OrderItems: {
          include: {
            product: true,
          },
        },
      },
    })
  }
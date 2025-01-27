'use server'

import { ORDER_TAG } from '@/lib/constant'
import prisma from '@/prisma/db'
import { unstable_cache } from 'next/cache'

export const getAllOrder = unstable_cache(
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
  },
  undefined,
  {
    tags: [ORDER_TAG],
  }
)

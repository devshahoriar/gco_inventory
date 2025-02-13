'use server'

import { REQUISITION_TAG } from '@/lib/constant'
import prisma from '@/prisma/db'
import { unstable_cache } from 'next/cache'


export const countReq = unstable_cache(
  async (orgId: string) => {
    return prisma.requisition.count({
      where: {
        organizationId: orgId,
      },
    })
  },
  undefined,
  {
    tags: [REQUISITION_TAG],
  }
)

export const getAllReq = unstable_cache(
  async (orgId: string) => {
    return prisma.requisition.findMany({
      where: {
        organizationId: orgId,
      },
      select: {
        id: true,
        createdAt: true,
        naration: true,
        regNumber: true,
        reqDate: true,
        isOrdered: true,
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
  },
  undefined,
  {
    tags: [REQUISITION_TAG],
  }
)

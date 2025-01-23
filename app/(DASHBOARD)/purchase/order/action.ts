'use server'

import { ORDER_TAG } from '@/lib/constant'
import prisma from '@/prisma/db'
import { unstable_cache } from 'next/cache'

export const getAllOrder = unstable_cache(async (orgId:string) => { 
  return prisma.order.findMany({
    where: {
      orgId: orgId,
    },
    include: {
      Branch: true,
      Warehouse: true,
      OrderItems: {
        include: {
          product: true
        }
      }
    }
  })
},undefined,{
  tags: [ORDER_TAG]
})

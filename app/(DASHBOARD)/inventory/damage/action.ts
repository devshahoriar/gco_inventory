'use server'

import { getActiveOrg } from '@/lib/auth'
import prisma from '@/prisma/db'

export const getDamageRecords = async () => {
  const orgId = await getActiveOrg()

  try {
    const damageRecords = await prisma.damage.findMany({
      where: {
        orgId,
      },
      select: {
        id: true,
        damageNo: true,
        damageDate: true,
        quantity: true,
        price: true,
        remark: true,
        product: {
          select: {
            name: true,
            productUnit: {
              select: {
                unit: true,
              },
            },
          },
        },
        Warehouse: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        damageDate: 'desc',
      },
    })
    
    return damageRecords
    
  } catch (error) {
    console.error('Error fetching damage records:', error)
    throw new Error('Failed to fetch damage records')
  }
}
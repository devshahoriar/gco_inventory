/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { getActiveOrg } from '@/lib/auth'
import prisma from '@/prisma/db'

interface ChallanData {
  orderId: string;
  challanNumber: string;
  challanDate: Date;
  challanDueDate: Date;
  branceId: string;
  warehouseId: string;
  supplierId: string;
  shippingAddress: string;
  remarks: string;
  items: {
    quantity: number;
    rate: number;
    batch: string;
    description: string;
    productId: string;
  }[];
}

export const getChallanNumber = async () => {
  const orgId = await getActiveOrg()
  const challan = await prisma.challan.count({
    where: {
      orgId,
    },
  })
  return `CH-${challan + 1}`
}

export const getOrderForSelect = async () => {
  const orgId = await getActiveOrg()
  return await prisma.order.findMany({
    where: {
      orgId,
    },
    select: {
      id: true,
      orderNo: true,
      _count: {
        select: {
          OrderItems: true,
        },
      },
    },
  })
}

export const getOrderInForChallan = async (orderId: string) => {
  return prisma.order.findUnique({
    where: {
      id: orderId,
    },
    select: {
      id: true,
      dueDate: true,
      orderDate: true,
      supingAddress: true,
      OrderItems: {
        select: {
          id: true,
          product: {
            select: {
              id: true,
              name: true,
              ProductGroup: {
                select: {
                  name: true,
                },
              },
            },
          },
          quantity: true,
          price: true,
        },
      },
      Branch: {
        select: {
          id: true,
          name: true,
        },
      },
      Warehouse: {
        select: {
          id: true,
          name: true,
        },
      },
      Supplier: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
}

export const createChallan = async (data: ChallanData) => {
  const orgId = await getActiveOrg()
  
  try {
    const challan = await prisma.challan.create({
      data: {
        orderId: data.orderId,
        challanNo: data.challanNumber,
        challanDate: data.challanDate,
        challanDueDate: data.challanDueDate,
        branceId: data.branceId,
        warehouseId: data.warehouseId,
        supplierId: data.supplierId,
        supingAddress: data.shippingAddress,
        remarks: data.remarks,
        orgId,
        ChallanItems: {
          createMany: {
            data: data.items
          }
        }
      },
      include: {
        ChallanItems: true
      }
    })
    
    return { success: true, data: challan }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Failed to create challan' }
  }
}
'use server'

import { getActiveOrg } from '@/lib/auth'
import prisma from '@/prisma/db'

export const getWarehouseForSelect = async () => {
  const orgId = await getActiveOrg()
  return prisma.warehouse.findMany({
    where: {
      organizationId: orgId,
      active: true,
    },
    select: {
      id: true,
      name: true,
    },
  })
}

export const getProductGroup = async (text?: string, id?: string) => {
  const orgId = await getActiveOrg()
  const whereFilter = {
    organizationId: orgId,
    ...(text ? { name: { contains: text } } : {}),
    ...(id ? { id: id } : {}),
  }

  return await prisma.productGroup.findMany({
    where: whereFilter,
    take: 20,
    select: {
      id: true,
      name: true,
    },
  })
}

export const getProductsForSelect = async (groupId?: string, text?: string) => {
  const orgId = await getActiveOrg()
  return prisma.product.findMany({
    where: {
      organizationId: orgId,
      ...(groupId ? { productGroupId: groupId } : {}),
      ...(text ? { name: { contains: text } } : {}),
    },
    select: {
      id: true,
      name: true,
      productGroupId: true,
      productUnit: {
        select: {
          unit: true,
        },
      },
      StockItems: {
        where: {
          orgId: orgId,
        },
        select: {
          quantity: true,
        },
      },
    },
    take: 20,
  })
}

export const saveOpningBalance = async (data: {
  warehouseId: string
  openData: Date
  items: Array<{
    productId: string
    quantity: number
    adjustQuantity: number
    remark?: string
  }>
}) => {
  const orgId = await getActiveOrg()

  try {
    return await prisma.$transaction(async (tx) => {
      const items = await tx.opningBalances.createMany({
        data: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity + item.adjustQuantity,
          rate: 0,
          remark: item.remark,
          warehouseId: data.warehouseId,
          orgId: orgId,
          openData: data.openData,
        })),
      })

      for (const item of data.items) {
        const existingStock = await tx.stockItems.findFirst({
          where: {
            productId: item.productId,
            warehouseId: data.warehouseId,
            orgId: orgId,
            batch: 'OPENING-BALANCE',
          },
        })

        const finalQuantity = item.quantity + item.adjustQuantity

        if (existingStock) {
          await tx.stockItems.update({
            where: { id: existingStock.id },
            data: {
              quantity: finalQuantity,
              description: item.remark || 'Opening Balance Entry',
            },
          })
        } 
      }
      return { success: true, count: items.count }
    })
  } catch (error) {
    console.error(error)
    throw new Error('Failed to save opening balance')
  }
}

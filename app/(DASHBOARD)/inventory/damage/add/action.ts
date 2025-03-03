/* eslint-disable @typescript-eslint/no-explicit-any */
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

export const saveDamage = async (data: {
  damageNo: string
  warehouseId: string
  productId: string
  quantity: number
  remark?: string
  damageDate: Date
}) => {
  const orgId = await getActiveOrg()
  
  // Validation checks
  if (!data.damageNo) {
    return { error: true, message: 'Damage No is required' }
  }
  
  if (!data.warehouseId) {
    return { error: true, message: 'Warehouse is required' }
  }
  
  if (!data.productId) {
    return { error: true, message: 'Product is required' }
  }
  
  if (!data.quantity || data.quantity <= 0) {
    return { error: true, message: 'Quantity must be greater than 0' }
  }

  try {
    // Check if there's enough stock
    const stockItem = await prisma.stockItems.findFirst({
      where: {
        productId: data.productId,
        warehouseId: data.warehouseId,
        orgId: orgId,
      },
      select: {
        quantity: true,
      },
    })

    if (!stockItem || stockItem.quantity < data.quantity) {
      return { error: true, message: 'Not enough stock available' }
    }

    const result = await prisma.$transaction(async (tx) => {
      // Create damage record
      const damage = await tx.damage.create({
        data: {
          damageNo: data.damageNo,
          wareHouseId: data.warehouseId,
          productId: data.productId,
          quantity: data.quantity,
          remark: data.remark,
          damageDate: data.damageDate,
          orgId: orgId,
        },
      })

      // Update stock quantity
      await tx.stockItems.updateMany({
        where: {
          productId: data.productId,
          warehouseId: data.warehouseId,
          orgId: orgId,
        },
        data: {
          quantity: {
            decrement: data.quantity,
          },
        },
      })

      return { success: true, id: damage.id }
    })

    return result
  } catch (error: any) {
    console.error('Error saving damage:', error)
    return { 
      error: true, 
      message: error.message || 'Failed to save damage record'
    }
  }
}

export const generateDamageNo = async () => {
  const orgId = await getActiveOrg()
  
  // Get the last damage number
  const lastDamage = await prisma.damage.findFirst({
    where: { orgId },
    orderBy: { damageNo: 'desc' },
    select: { damageNo: true }
  })
  
  // Generate new damage number based on last one
  let newNumber = 1
  
  if (lastDamage) {
    // Extract the numeric part from the last damage number
    const match = lastDamage.damageNo.match(/DMG-(\d+)/)
    if (match) {
      newNumber = parseInt(match[1]) + 1
    }
  }
  
  return `DMG-${newNumber.toString().padStart(4, '0')}`
}
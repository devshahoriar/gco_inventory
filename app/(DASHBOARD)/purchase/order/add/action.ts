/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'
import { getActiveOrg } from '@/lib/auth'
import { ORDER_TAG } from '@/lib/constant'
import prisma from '@/prisma/db'
import { revalidateTag } from 'next/cache'

export const getRegesitionForSelect = async (text?: string, id?: string) => {
  const orgId = await getActiveOrg()
  return await prisma.requisition.findMany({
    where: {
      organizationId: orgId,
      regNumber: {
        contains: text,
      },
      id: id ? id : undefined,
      isOrdered: false,
    },
    select: {
      id: true,
      regNumber: true,
      _count: {
        select: {
          reqItems: true,
        },
      },
    },
    take: 20,
  })
}

export const getBrancesForSelect = async (text?: string, id?: string) => {
  const orgId = await getActiveOrg()
  return await prisma.branch.findMany({
    where: {
      organizationId: orgId,
      name: {
        contains: text,
      },
      id: id ? id : undefined,
    },
    take: 20,
    select: {
      id: true,
      name: true,
    },
  })
}

export const getSuppliersForSelect = async (text?: string, id?: string) => {
  const orgId = await getActiveOrg()
  return await prisma.supplier.findMany({
    where: {
      organizationId: orgId,
      name: {
        contains: text,
      },
      id: id ? id : undefined,
    },
    take: 20,
    select: {
      id: true,
      name: true,
    },
  })
}

export const getWarehousesForSelect = async (text?: string, id?: string) => {
  const orgId = await getActiveOrg()
  return await prisma.warehouse.findMany({
    where: {
      organizationId: orgId,
      name: {
        contains: text,
      },
      id: id ? id : undefined,
    },
    take: 20,
    select: {
      id: true,
      name: true,
    },
  })
}

export const getOrderNo = async () => {
  const orgId = await getActiveOrg()
  const orderCount = await prisma.order.count({
    where: {
      orgId: orgId,
    },
  })
  return "Order-"+orderCount + 1
}

// ⬆️⬆️⬆️  other data for select ⬆️⬆️⬆️

export const getPreRequisition = async (id: string) => {
  const req = await prisma.requisition.findUnique({
    where: { id },
    select: {
      reqDate: true,
      reqItems: {
        select: {
          quantity: true,
          product: {
            select: {
              name: true,
              id: true,
              ProductGroup: {
                select: {
                  id: true,
                  name: true,
                },
              },
              productUnit: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  })
  return req
}

export const createOrder = async (data: any) => {
  try {
    const orgId = await getActiveOrg()

    // Validate required fields
    if (!data.orderNo || !data.supplierId || !data.warehouseId || !data.branchId) {
      throw new Error('Missing required fields')
    }

    // Validate products
    if (!Array.isArray(data.products) || data.products.length === 0) {
      throw new Error('No products provided')
    }

    // Validate all products have valid prices
    if (data.products.some((p: any) => !p.rate || Number(p.rate) <= 0)) {
      throw new Error('All products must have valid prices')
    }

    // Check if order number already exists
    const existingOrder = await prisma.order.findUnique({
      where: { orderNo: data.orderNo },
      select:{
        id: true
      }
    })

    if (existingOrder) {
      throw new Error('Order number already exists')
    }

    // Create order with items in a transaction
    revalidateTag(ORDER_TAG)
    const result = await prisma.$transaction(async (tx) => {
      // Create the order
      const order = await tx.order.create({
        data: {
          orderNo: data.orderNo,
          orderDate: new Date(data.orderDate),
          dueDate: new Date(data.deuDate),
          orgId: orgId,
          branceId: data.branchId,
          warehouseId: data.warehouseId,
          supplierId: data.supplierId,
          supingAddress: data.shippingAddress,
          remarks: data.remark,
        },
        select:{
          id: true
        }
      })

      // Create order items
      const orderItems = await Promise.all(
        data.products.map((product: any) =>
          tx.orderItems.create({
            data: {
              orderId: order.id,
              productId: product.productId,
              quantity: product.quantity,
              price: parseFloat(product.rate),
            },
            select:{
              id: true
            }
          })
        )
      )

      // Update requisition status if reqId exists
      if (data.regId) {
        await tx.requisition.update({
          where: { id: data.regId },
          data: { isOrdered: true },
          select:{
            id: true
          }
        })
      }

      return { order, orderItems }
    })

    return result

  } catch (error: any) {
    if (error.code === 'P2002') {
      throw new Error('Duplicate order number')
    }
    if (error.code === 'P2003') {
      throw new Error('Invalid reference to product, supplier, or warehouse')
    }
    throw new Error(error?.message || 'Failed to create order')
  }
}

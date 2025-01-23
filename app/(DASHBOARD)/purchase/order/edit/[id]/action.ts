/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'
import prisma from '@/prisma/db'
import { revalidateTag } from 'next/cache'
import { ORDER_TAG } from '@/lib/constant'

export const getOrder = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      OrderItems: {
        include: {
          product: {
            include: {
              ProductGroup: true,
              productUnit: true,
            },
          },
        },
      },
      Branch: true,
      Warehouse: true,
      Supplier: true,
    },
  })
  return order
}

export const updateOrder = async (id: string, data: any) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Update the order
      const order = await tx.order.update({
        where: { id },
        data: {
          orderDate: new Date(data.orderDate),
          dueDate: new Date(data.deuDate),
          branceId: data.branchId,
          warehouseId: data.warehouseId,
          supplierId: data.supplierId,
          supingAddress: data.shippingAddress,
          remarks: data.remark,
        },
      })

      // Delete existing order items
      await tx.orderItems.deleteMany({
        where: { orderId: id },
      })

      // Create new order items
      const orderItems = await Promise.all(
        data.products.map((product: any) =>
          tx.orderItems.create({
            data: {
              orderId: order.id,
              productId: product.productId,
              quantity: product.quantity,
              price: parseFloat(product.rate),
            },
          })
        )
      )

      return { order, orderItems }
    })

    revalidateTag(ORDER_TAG)
    return result
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to update order')
  }
}

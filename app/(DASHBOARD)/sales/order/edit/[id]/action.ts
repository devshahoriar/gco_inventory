/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import prisma from '@/prisma/db'

export const getSalesOrderById = async (id: string, orgId: string) => {
  return prisma.sealsOrder.findFirst({
    where: {
      id: id,
      orgId: orgId,
      SealsChallan: null, // Ensure order hasn't been converted to challan
    },
    include: {
      SealsProduct: {
        include: {
          product: {
            include: {
              productUnit: true,
            },
          },
        },
      },
      Branch: true,
      Warehouse: true,
      Customers: true,
    },
  })
}

export const updateSalesOrder = async (id: string, data: any) => {
  try {
    // Validate required fields
    if (
      !data.orderNo ||
      !data.branceId ||
      !data.warehoueId ||
      !data.customerId ||
      !data.salesExucutiveId ||
      !data.address ||
      !data.contactPerson ||
      !data.contactNumber
    ) {
      throw new Error('Missing required fields')
    }

    // Validate products
    if (!Array.isArray(data.products) || data.products.length === 0) {
      throw new Error('No products provided')
    }

    return await prisma.$transaction(async (tx) => {
      // Delete existing products
      await tx.sealsProduct.deleteMany({
        where: { sealsId: id },
      })

      // Update order and create new products
      const updatedOrder = await tx.sealsOrder.update({
        where: { id: id },
        data: {
          branceId: data.branceId,
          warehoueId: data.warehoueId,
          customerId: data.customerId,
          address: data.address,
          remarks: data.remarks,
          placesOfDelivery: data.placesOfDelivery,
          orderDate: data.orderDate,
          deliveryDate: data.deliveryDate,
          salesExucutiveId: data.salesExucutiveId,
          contactPerson: data.contactPerson,
          contactNumber: data.contactNumber,
          SealsProduct: {
            createMany: {
              data: data.products.map((product: any) => ({
                productId: product.productId,
                quantity: product.quantity,
                rate: product.rate,
              })),
            },
          },
        },
      })

      return updatedOrder
    })
  } catch (error: any) {
    console.error('Update Sales Order Error:', error)
    throw new Error(error?.message || 'Failed to update sales order')
  }
}

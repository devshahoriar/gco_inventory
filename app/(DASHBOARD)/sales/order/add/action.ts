/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { getActiveOrg } from '@/lib/auth'
import prisma from '@/prisma/db'
import { format } from 'date-fns'

export const getBranchesForSelect = async (text?: string, id?: string) => {
  const orgId = await getActiveOrg()
  return await prisma.branch.findMany({
    where: {
      organizationId: orgId,
      name: { contains: text },
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
      name: { contains: text },
      id: id ? id : undefined,
    },
    take: 20,
    select: {
      id: true,
      name: true,
    },
  })
}

export const getCustomersForSelect = async (text?: string, id?: string) => {
  const orgId = await getActiveOrg()
  return await prisma.customers.findMany({
    where: {
      orgId: orgId,
      name: { contains: text },
      id: id ? id : undefined,
      status: true,
    },
    take: 20,
    select: {
      id: true,
      name: true,
    },
  })
}

export const getSalesExecutivesForSelect = async (text?: string, id?: string) => {
  const orgId = await getActiveOrg()
  return await prisma.user.findMany({
    where: {
      name: { contains: text },
      id: id ? id : undefined,
      members: {
        some: {
          organizationId: orgId,
        },
      },
    },
    take: 20,
    select: {
      id: true,
      name: true,
    },
  })
}

export const getProductsForSelect = async (text?: string, id?: string) => {
  const orgId = await getActiveOrg()
  return await prisma.product.findMany({
    where: {
      organizationId: orgId,
      name: { contains: text },
      id: id ? id : undefined,
    },
    select: {
      id: true,
      name: true,
      productUnit: {
        select: {
          name: true,
        },
      },
    },
    take: 20,
  })
}

export const getProductUnit = async (productId: string) => {
  if (!productId) return null
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      productUnit: {
        select: {
          name: true,
          id: true
        }
      }
    }
  })
  return product?.productUnit
}

export const getSalesOrderNo = async () => {
  const orgId = await getActiveOrg()
  const orderCount = await prisma.sealsOrder.count({
    where: {
      orgId: orgId,
    },
  })
  return 'SO-' + (orderCount + 1) + '-' + format(new Date(), 'dd/MM/yyyy')
}

export const createSalesOrder = async (data: any) => {
  try {
    const orgId = await getActiveOrg()

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

    // Validate all products have valid prices and quantities
    if (data.products.some((p: any) => !p.rate || Number(p.rate) <= 0)) {
      throw new Error('All products must have valid prices')
    }
    if (data.products.some((p: any) => !p.quantity || Number(p.quantity) <= 0)) {
      throw new Error('All products must have valid quantities')
    }

    // Create sales order with items in a transaction
    const result = await prisma.$transaction(
      async (tx) => {
        // Create the sales order
        const salesOrder = await tx.sealsOrder.create({
          data: {
            orderNo: data.orderNo,
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
            orgId: orgId,
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

        return salesOrder
      },
      {
        maxWait: 5000,
        timeout: 10000,
      }
    )

    return result
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw new Error('Duplicate order number')
    }
    if (error.code === 'P2003') {
      throw new Error('Invalid reference to product, customer, or warehouse')
    }
    console.error('Sales Order Error:', error)
    throw new Error(error?.message || 'Failed to create sales order')
  }
}
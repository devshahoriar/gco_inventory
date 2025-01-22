/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'
import { getActiveOrg } from '@/lib/auth'
import prisma from '@/prisma/db'

export const getAllProductByOrganization = async (organizationId: string) => {
  return await prisma.product.findMany({
    where: {
      organizationId: organizationId,
    },
    select: {
      id: true,
      name: true,
      productGroupId: true,
      productUnitId: true,
      productUnit: {
        select: {
          name: true,
        },
      },

      ProductGroup: {
        select: {
          name: true,
        },
      },
    },
  })
}

export const getAllWarehouseByOrganization = async () => {
  const orgId = await getActiveOrg()

  const unit = await prisma.productUnit.findMany({
    where: {
      organizationId: orgId
    },
    select: {
      id: true,
      name: true,
    },
  })
  const productGroup = await prisma.productGroup.findMany({
    where: {
      organizationId: orgId
    },
    select: {
      id: true,
      name: true,
    },
  })
  return {  unit, productGroup }
}

export const createProduct = async (data: any) => {
  const orgId = await getActiveOrg()
  await prisma.product.create({
    data: {
      name: data.name,
      productUnitId: data.unit,
      description: data.description,
      organizationId: orgId,
      productGroupId: data.productGroupId,
    },
  })
}

export const getProductById = async (id: string) => {
  const orgId = await getActiveOrg()
  return await prisma.product.findFirst({
    where: {
      id: id,
      organizationId: orgId
    },
    select: {
      id: true,
      name: true,
      description: true,
      productUnitId: true,
      productGroupId: true,
      productUnit: {
        select: {
          name: true,
        },
      },
      ProductGroup: {
        select: {
          name: true,
        },
      },
    },
  })
}

export const updateProduct = async (id: string, data: any) => {
  const orgId = await getActiveOrg()
  await prisma.product.update({
    where: {
      id: id,
      organizationId: orgId,
    },
    data: {
      name: data.name,
      productUnitId: data.unit,
      description: data.description,
      productGroupId: data.productGroupId,
    },
  })
}

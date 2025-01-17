/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'
import { getUser } from '@/lib/auth'
import prisma from '@/prisma/db'
import { headers } from 'next/headers'

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
  const user = await getUser(headers)

  const unit = await prisma.productUnit.findMany({
    where: {
      organizationId: user?.activeOrganizationId as string,
    },
    select: {
      id: true,
      name: true,
    },
  })
  const productGroup = await prisma.productGroup.findMany({
    where: {
      organizationId: user?.activeOrganizationId as string,
    },
    select: {
      id: true,
      name: true,
    },
  })
  return {  unit, productGroup }
}

export const createProduct = async (data: any) => {
  const user = await getUser(headers)
  await prisma.product.create({
    data: {
      name: data.name,
      productUnitId: data.unit,
      description: data.description,
      organizationId: user?.activeOrganizationId as string,
      productGroupId: data.productGroupId,
    },
  })
}

export const getProductById = async (id: string) => {
  const user = await getUser(headers)
  return await prisma.product.findFirst({
    where: {
      id: id,
      organizationId: user?.activeOrganizationId as string,
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
  const user = await getUser(headers)
  await prisma.product.update({
    where: {
      id: id,
      organizationId: user?.activeOrganizationId as string,
    },
    data: {
      name: data.name,
      productUnitId: data.unit,
      description: data.description,
      productGroupId: data.productGroupId,
    },
  })
}

/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'
import prisma from '@/prisma/db'

export const getProductUnitByOrgId = async (orgId: string) => {
  return await prisma.productUnit.findMany({
    where: {
      organizationId: orgId,
    },
    omit:{
      organizationId:true
    }
  })
}

export const createProductUnit = async (data: any) => {
  await prisma.productUnit.create({
    data: {
      name: data.name,
      unit: data.unit,
      description: data.description,
      organizationId: data.organizationId,
    },
  })
}

export const updateProductUnit = async (id: string, data: any) => {
  await prisma.productUnit.update({
    where: { id },
    data: {
      name: data.name,
      unit: data.unit,
      description: data.description,
    },
  })
}

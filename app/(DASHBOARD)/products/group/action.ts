/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'
import prisma from '@/prisma/db'



export const getProductGroupByOrgId = 
  async (orgId: string) => {
    return prisma.productGroup.findMany({
      where: {
        organizationId: orgId,
      },
      omit: {
        organizationId: true,
      },
    })
  }

export const createProductGroup = async (data: any) => {

  await prisma.productGroup.create({
    data: {
      name: data.name,
      group: data.group,
      description: data.description,
      organizationId: data.organizationId,
    },
  })
}

export const updateProductGroup = async (id: string, data: any) => {

  await prisma.productGroup.update({
    where: { id },
    data: {
      name: data.name,
      group: data.group,
      description: data.description,
    },
  })
}

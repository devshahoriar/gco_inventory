"use server"
import prisma from '@/prisma/db'

export const getAllReturnByOrg = async (orgId: string) => {
  const returns = await prisma.return.findMany({
    where: {
      orgId: orgId,
    },
    select: {
      id: true,
      returnNo: true,
      returnDate: true,
      ReturnItems: {
        select: {
          id: true,
          quantity: true,
          rate: true,
        },
      },
      Warehouse: {
        select: {
          name: true,
          id: true,
        },
      },
      Supplier: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  return returns
}

export const getAllReturnCountInOrg = async (orgId: string) => {
  return prisma.return.count({
    where: {
      orgId,
    },
  })
}

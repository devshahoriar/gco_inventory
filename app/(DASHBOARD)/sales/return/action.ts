'use server'
import prisma from '@/prisma/db'

export const getAllSalesReturnByOrg = async (orgId: string) => {
  const salesReturns = await prisma.sealsReturn.findMany({
    where: {
      orgId: orgId,
    },
    select: {
      id: true,
      returnNo: true,
      returnDate: true,
      SealsReturnItems: {
        select: {
          id: true,
          quentity: true,
          rate: true,
        },
      },
      Warehouse: {
        select: {
          name: true,
          id: true,
        },
      },
      Customers: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  return salesReturns
}

export const getAllSalesReturnCountInOrg = async (orgId: string) => {
  return prisma.sealsReturn.count({
    where: {
      orgId,
    },
  })
}
'use server'

import prisma from '@/prisma/db'

export const getAllOpningBalanceForOrg = async (orgId: string) => {
  const opningBalances = await prisma.opningBalances.findMany({
    where: {
      orgId: orgId,
    },
    select: {
      id: true,
      quantity: true,
      rate: true,
      remark: true,
      openData: true,
      product: {
        select: {
          id: true,
          name: true,
        },
      },
      warehouse: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  return opningBalances
}
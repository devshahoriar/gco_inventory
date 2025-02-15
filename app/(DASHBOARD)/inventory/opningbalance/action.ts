'use server'

import prisma from '@/prisma/db'

export const getAllOpningBalanceForOrg = async (orgId: string) => {
  const opningBalances = await prisma.opningBalances.findMany({
    where: {
      orgId: orgId,
    },
    include: {
      OpningBalancesItem: {
        include: {
          product: true,
          warehouse: true,
        }
      }
    },
    orderBy: {
      openDate: 'desc'
    }
  })

  return opningBalances
}
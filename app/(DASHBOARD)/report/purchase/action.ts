'use server'

import { getActiveOrg } from '@/lib/auth'
import prisma from '@/prisma/db'

export const getAllBrances = async (q: string) => {
  const activOrgId = await getActiveOrg()
  return await prisma.branch.findMany({
    where: {
      organizationId: activOrgId,
      name: {
        contains: q,
      },
    },
    select: {
      id: true,
      name: true,
    },
  })
}

export const getPurches = async (
  branchId: string,
  startDate: Date,
  endDate: Date
) => {
  const activOrgId = await getActiveOrg()
  return await prisma.invoice.findMany({
    where: {
      orgId: activOrgId,
      branceId: branchId,
      invoideDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      id: true,
      invoideDate: true,
      invoiceNo: true,
      InvoiceItems: {
        select: {
          quantity: true,
          rate: true,
          discount: true,
          product: {
            select: {
              name: true,
              productUnit: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      Supplier: {
        select: {
          name: true,
        },
      },
    },
  })
}

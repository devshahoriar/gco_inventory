/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { getActiveOrg } from '@/lib/auth'
import prisma from '@/prisma/db'

export const getAllBrances = async (q: string) => {
  const activOrgId = await getActiveOrg()
  const branches = await prisma.branch.findMany({
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
  
  // Add "All Branches" option at the top
  return [
    { id: "all", name: "All Branches" },
    ...branches
  ]
}

export const getPurches = async (
  branchId: string,
  startDate: Date,
  endDate: Date
) => {
  const activOrgId = await getActiveOrg()
  
  // Base query condition - filter by organization and date range
  const whereCondition: any = {
    orgId: activOrgId,
    invoideDate: {
      gte: startDate,
      lte: endDate,
    },
  }
  
  // If specific branch is selected (not "all"), add branch filter
  if (branchId !== "all") {
    whereCondition.branceId = branchId;
  }
  
  return await prisma.invoice.findMany({
    where: whereCondition,
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
      Branch: {
        select: {
          name: true,
        }
      },
    },
    orderBy: [
      { Branch: { name: 'asc' } },
      { invoideDate: 'asc' }
    ]
  })
}

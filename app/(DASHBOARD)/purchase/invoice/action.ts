'use server'

import prisma from '@/prisma/db'

export const getAllInviceForOrg = async (orgId: string) => {
  const invoices = await prisma.invoice.findMany({
    where: {
      orgId: orgId,
    },
    select: {
      id: true,
      invoiceNo: true,
      address: true,
      invoideDate: true,
      InvoiceItems: {
        select: {
          id: true,
          quantity: true,
          rate: true,
          discount: true,
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

  return invoices
}

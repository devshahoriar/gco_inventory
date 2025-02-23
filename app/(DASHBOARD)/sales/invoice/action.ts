'use server'

import prisma from '@/prisma/db'

export const getAllSalesInvoices = async (orgId: string) => {
  const invoices = await prisma.salesInvoice.findMany({
    where: {
      orgId: orgId,
    },
    select: {
      id: true,
      invoiceNo: true,
      address: true,
      invoiceDate: true,
      netInvoiceAmount: true,
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
      InvoiceItems: {
        select: {
          id: true,
          quantity: true,
          rate: true,
          discount: true,
        },
      },
    },
  })

  return invoices
}
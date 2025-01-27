/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { getActiveOrg } from '@/lib/auth'
import prisma from '@/prisma/db'
import { format } from 'date-fns'

export const addInvoice = async (data: any) => {
  try {
    const orgId = await getActiveOrg()

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNo: data.invoiceNo,
        invoideDate: new Date(data.invoideDate),
        challanId: data.challanId,
        branceId: data.branceId,
        orgId: orgId,
        wareHouseId: data.wareHouseId,
        supplierId: data.supplierId,
        address: data.address,
        remarks: data.remarks,
        InvoiceAmmount: data.InvoiceAmmount,
        InvoiceItems: {
          createMany: {
            data: data.items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              rate: parseFloat(item.rate),
              batch: item.batch || '',
              discount: item.discount || 0,
              description: item.description || '',
            })),
          },
        },
      },
      select: {
        id: true,
      },
    })

    await prisma.challan.update({
      where: {
        id: data.challanId,
      },
      data: {
        isInvoiceEd: true,
      },
    })

    return invoice
  } catch (error) {
    console.log(error)
    throw new Error('server error.')
  }
}

export const getInvoiceNumber = async () => {
  const orgId = await getActiveOrg()
  const c = await prisma.invoice.count({
    where: {
      orgId: orgId,
    },
  })
  return `INV-${c + 1}-${format(new Date(), 'dd/MM/yyyy')}`
}

export const getChalanForSelect = async (v?: string) => {
  const orgId = await getActiveOrg()
  return prisma.challan.findMany({
    where: {
      orgId: orgId,
      isInvoiceEd: false,
      challanNo: {
        contains: v,
      },
    },
    select: {
      id: true,
      challanNo: true,
      Branch: {
        select: {
          name: true,
          id: true,
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
          name: true,
          id: true,
        },
      },
      supingAddress: true,
      ChallanItems: {
        select: {
          quantity: true,
          rate: true,
          product: {
            select: {
              name: true,
              id: true,
              ProductGroup: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      _count: {
        select: {
          ChallanItems: true,
        },
      },
    },
  })
}

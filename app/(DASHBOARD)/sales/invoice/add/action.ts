/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { getActiveOrg } from '@/lib/auth'
import prisma from '@/prisma/db'
import { format } from 'date-fns'
import { after } from 'next/server'

export const getInvoiceNumber = async () => {
  const orgId = await getActiveOrg()
  const count = await prisma.salesInvoice.count({
    where: { orgId },
  })
  return `SINV-${count + 1}-${format(new Date(), 'dd/MM/yyyy')}`
}

export const getSalesChallanForSelect = async (searchText?: string) => {
  const orgId = await getActiveOrg()

  return prisma.sealsChallan.findMany({
    where: {
      orgId,
      salessChallanNo: {
        contains: searchText,
      },
      // Only get challans that don't have invoices yet
      SalesInvoice: null,
    },
    select: {
      id: true,
      salessChallanNo: true,
      Branch: {
        select: {
          id: true,
          name: true,
        },
      },
      Warehouse: {
        select: {
          id: true,
          name: true,
        },
      },
      Customers: {
        select: {
          id: true,
          name: true,
        },
      },
      addreess: true,
      sealsChallanItems: {
        select: {
          quantity: true,
          product: {
            select: {
              id: true,
              name: true,
              productUnit: {
                select: {
                  unit: true,
                },
              },
            },
          },
        },
      },
      sealsExucutive: {
        select: {
          id: true,
          name: true,
        },
      },
      exclusiveMobile: true,
      _count: {
        select: {
          sealsChallanItems: true,
        },
      },
    },
  })
}

export const addSalesInvoice = async (data: any) => {
  try {
    const orgId = await getActiveOrg()

    // First check stock availability for all items
    for (const item of data.items) {
      const existingStock = await prisma.stockItems.findFirst({
        where: {
          productId: item.productId,
          warehouseId: data.warehouseId,
          orgId: orgId,
          batch: item.batch,
        },
      })

      if (!existingStock || existingStock.quantity < item.quantity) {
        throw new Error(
          `Insufficient stock for product: ${item.productName}. Available: ${
            existingStock?.quantity || 0
          }`
        )
      }
    }

    // Create invoice if stock is available
    const invoice = await prisma.salesInvoice.create({
      data: {
        invoiceNo: data.invoiceNo,
        invoiceDate: new Date(data.invoiceDate),
        deliveryDate: new Date(data.deliveryDate),
        branceId: data.branchId,
        wareHouseId: data.warehouseId,
        customerId: data.customerId,
        salesledger: data.salesLedger,
        customerLedger: data.customerLedger,
        address: data.address,
        remarks: data.remarks || '',
        salesExucutiveId: data.salesExecutiveId,
        exucutiveMobile: data.executiveMobile,
        sealsChallanId: data.challanId,
        netInvoiceAmount: data.netAmount,
        orgId: orgId,
        InvoiceItems: {
          createMany: {
            data: data.items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              rate: item.rate,
              unit: item.unit,
              batch: item.batch,
              discount: item.discount,
            })),
          },
        },
      },
      select: {
        id: true,
      },
    })

    after(async () => {
      for (const item of data.items) {
        const existingStock = await prisma.stockItems.findFirst({
          where: {
            productId: item.productId,
            orgId: orgId,
          },
        })

        if (existingStock) {
          await prisma.stockItems.update({
            where: { id: existingStock.id },
            data: {
              quantity: existingStock.quantity - item.quantity,
            },
          })
        }
      }
    })

    return invoice
  } catch (error: any) {
    console.log('Error creating sales invoice:', error)
    throw new Error(error?.message || 'Failed to create sales invoice')
  }
}

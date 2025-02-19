/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { getActiveOrg } from '@/lib/auth'
import prisma from '@/prisma/db'
import { format } from 'date-fns'

export const getSalesChallanNumber = async () => {
  const orgId = await getActiveOrg()
  const challan = await prisma.sealsChallan.count({
    where: {
      orgId,
    },
  })
  return `SCH-${challan + 1}-${format(new Date(), 'dd/MM/yyyy')}`
}

export const getSalesOrderForSelect = async () => {
  const orgId = await getActiveOrg()
  return await prisma.sealsOrder.findMany({
    where: {
      orgId,
      SealsChallan: null, // Only get orders that don't have challans
    },
    select: {
      id: true,
      orderNo: true,
      _count: {
        select: {
          SealsProduct: true,
        },
      },
    },
  })
}

export const getOrderDetailsForChallan = async (orderId: string) => {
  return await prisma.sealsOrder.findUnique({
    where: {
      id: orderId,
    },
    include: {
      Branch: true,
      Warehouse: true,
      Customers: true,
      salesExucutive: true,
      SealsProduct: {
        include: {
          product: {
            include: {
              productUnit: true // Add this to get product unit
            }
          }
        },
      },
    },
  })
}

interface SealsChallanData {
  sealdOrderID: string
  salessChallanNo: string
  clallanDate: Date
  dueDate: Date
  brancesId: string
  wareHouseId: string
  customerId: string
  sealsExucutiveId: string
  contractPerson: string
  addreess: string
  designation: string
  remark: string
  contactNumber: string
  placesOfDelivery: string
  customerVat: string
  poNo: string
  poDate: Date
  exclusiveMobile: string
  salesOrder: string
  salesOrderDate: Date
  driverName: string
  driverMobile: string
  transotMode: string
  vehicleNo: string
  items: {
    productId: string
    quantity: number
    alterUnit: string
    description: string
  }[]
}

export const createSealsChallan = async (data: SealsChallanData) => {
  const orgId = await getActiveOrg()

  try {
    const challan = await prisma.sealsChallan.create({
      data: {
        salessChallanNo: data.salessChallanNo,
        sealdOrderID: data.sealdOrderID,
        clallanDate: data.clallanDate,
        dueDate: data.dueDate,
        brancesId: data.brancesId,
        wareHouseId: data.wareHouseId,
        customerId: data.customerId,
        sealsExucutiveId: data.sealsExucutiveId,
        contractPerson: data.contractPerson,
        addreess: data.addreess,
        designation: data.designation,
        remark: data.remark,
        contactNumber: data.contactNumber,
        placesOfDelivery: data.placesOfDelivery,
        customerVat: data.customerVat || '',
        poNo: data.poNo,
        poDate: data.poDate,
        exclusiveMobile: data.exclusiveMobile || '',
        salesOrder: data.salesOrder || '',
        salesOrderDate: data.salesOrderDate,
        driverName: data.driverName,
        driverMobile: data.driverMobile,
        transotMode: data.transotMode,
        vehicleNo: data.vehicleNo,
        orgId,
        sealsChallanItems: {
          createMany: {
            data: data.items,
          },
        },
      },
    })

    // Update order status
    await prisma.sealsOrder.update({
      where: { id: data.sealdOrderID },
      data: { SealsChallan: { connect: { id: challan.id } } },
    })

    return { success: true, data: challan }
  } catch (error: any) {
    console.error('Create sales challan error:', error)
    return {
      success: false,
      error: error?.message || 'Failed to create sales challan',
    }
  }
}

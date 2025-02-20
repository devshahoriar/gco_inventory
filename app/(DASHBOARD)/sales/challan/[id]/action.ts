'use server'

import prisma from '@/prisma/db'

export const getSalesChallan = async (id: string) => {
  return await prisma.sealsChallan.findUnique({
    where: { id },
    include: {
      Branch: true,
      Warehouse: true,
      Customers: true,
      sealsExucutive: true,
      SealsOrder: true,
      sealsChallanItems: {
        include: {
          product: {
            include: {
              productUnit: true
            }
          }
        }
      }
    }
  })
}

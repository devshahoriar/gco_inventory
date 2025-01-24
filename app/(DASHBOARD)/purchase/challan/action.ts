import prisma from '@/prisma/db'

export const getAllChallan = async (orgId: string) => {
  return await prisma.challan.findMany({
    where: {
      orgId: orgId,
    },
    include: {
      Supplier: true,
      ChallanItems: {
        include: {
          product: true,
        },
      },
    },
  })
}

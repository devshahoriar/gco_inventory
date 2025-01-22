'use server'

import { getActiveOrg } from '@/lib/auth'
import prisma from '@/prisma/db'

export const getAllOrder = async () => {
  const orgId = await getActiveOrg()
  return await prisma.order.findMany({
    where: {
      orgId: orgId,
    },
  })
}

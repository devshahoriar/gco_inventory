'use server'

import { getUser } from '@/lib/auth'
import prisma from '@/prisma/db'
import { headers } from 'next/headers'

export const getAllOrder = async () => {
  const user = await getUser(headers)
  return await prisma.order.findMany({
    where: {
      orgId: user?.activeOrganizationId,
    },
  })
}

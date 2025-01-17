import prisma from '@/prisma/db'
import { cache } from 'react'

export const getOrgById = cache(async (id: string | null) => {
  if (!id) return null
  const item = await prisma.organization.findUnique({
    where: {
      id: id,
    },
    select: {
      name: true,
    },
  })
  return item
})

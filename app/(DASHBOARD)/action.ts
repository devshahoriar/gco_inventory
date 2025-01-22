import prisma from '@/prisma/db'

import { unstable_cache } from 'next/cache'

export const getOrgById = unstable_cache(async (id) => {
  return prisma.organization.findUnique({
    where: {
      id: id,
    },
    select: {
      name: true,
    },
  })
})

import prisma from '@/prisma/db'


export const getOrgById = async (id:string) => {
  return prisma.organization.findUnique({
    where: {
      id: id,
    },
    select: {
      name: true,
    },
  })
}

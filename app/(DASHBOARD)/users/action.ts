import prisma from '@/prisma/db'

export const getAllMembersByOrgId = async (orgId: string) => {
  return await prisma.member.findMany({
    where: {
      organizationId: orgId,
    },
    select: {
      user: {
        omit: {
          createdAt: true,
          updatedAt: true,
          emailVerified: true,
        },
      },
      ban: true,
      permissions: true,
      role: true,
      createdAt: true,
    },
  })
}

import { CHALLAN_TAG } from '@/lib/constant'
import prisma from '@/prisma/db'
import { unstable_cache } from 'next/cache'

export class Challan {
  orgId!: string
  tag: string = CHALLAN_TAG + this.orgId
  constructor(orgId: string) {
    this.orgId = orgId
  }
  getAllChallan = unstable_cache(
    async () =>
      prisma.challan.findMany({
        where: {
          orgId: this.orgId,
        },
      }),
    undefined,
    {
      tags: [CHALLAN_TAG, this.tag],
    }
  )
}

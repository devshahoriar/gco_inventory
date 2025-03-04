import { ContentLayout } from '@/components/admin-panel/content-layout'
import { PageLeftComponent, PageTopBar } from '@/components/shared/PageElement'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { getDamageRecords } from './action'
import { DamageTable } from './DamageTable'

export default async function DamagePage() {
  const damageRecords = await getDamageRecords()

  return (
    <ContentLayout title="Damage">
      <PageTopBar>
        <PageLeftComponent title="Damage Items" length={damageRecords.length} />
        <Button variant="outline" asChild>
          <Link href="/inventory/damage/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Damage
          </Link>
        </Button>
      </PageTopBar>

      <div className="mt-6">
        <DamageTable data={damageRecords} />
      </div>
    </ContentLayout>
  )
}

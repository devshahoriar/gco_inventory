import { ContentLayout } from '@/components/admin-panel/content-layout'
import { PageLeftComponent, PageTopBar } from '@/components/shared/PageElement'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const DamagePage = () => {
  return (
    <ContentLayout title="Damage">
      <PageTopBar>
        <PageLeftComponent title="Opening Balance" length={0} />
        <Button variant="outline" asChild>
          <Link href="/inventory/damage/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Damage
          </Link>
        </Button>
      </PageTopBar>
    </ContentLayout>
  )
}

export default DamagePage

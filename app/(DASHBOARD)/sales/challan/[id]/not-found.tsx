import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <h2 className="text-2xl font-bold">Sales Challan Not Found</h2>
      <p className="text-muted-foreground">
        Could not find the requested sales challan
      </p>
      <Button variant="outline" asChild>
        <Link href="/sales/challan">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Challans
        </Link>
      </Button>
    </div>
  )
}

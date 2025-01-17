import { LoaderPinwheel } from 'lucide-react'
import { ReactNode } from 'react'

export const PageTopBar = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex justify-between items-center bg-black bg-opacity-5 dark:bg-opacity-30 px-2 py-2 md:px-3 rounded-sm">
      {children}
    </div>
  )
}

export const PageLeftComponent = ({
  title,
  length,
}: {
  title: string
  length?: number | string
}) => {
  return (
    <div className="flex items-center gap-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      {length && (
        <span className="rounded-md bg-muted px-2 py-1 text-xs">
          {length} total
        </span>
      )}
    </div>
  )
}

export const FullPageLoder = () => {
  return (
    <div className="w-full h-[95vh] flex justify-center items-center cursor-wait">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-6xl font-bold">Loading...</h1>
        <LoaderPinwheel className="animate-spin size-8 opacity-80" />
      </div>
    </div>
  )
}

export const InputParent = ({ children }: { children: ReactNode }) => {
  return <div className="space-y-2">{children}</div>
}


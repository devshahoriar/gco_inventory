/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AppWindowMac,
  Bolt,
  Building2,
  Layers2,
  LayoutGrid,
  LucideIcon,
  NotebookText,
  Package,
  Settings,
  Users,
  BaggageClaim,
  ShieldEllipsis,
} from 'lucide-react'

type Submenu = {
  href: string
  label: string
  active?: boolean
}

type Menu = {
  href: string
  label: string
  active?: boolean
  icon: LucideIcon
  submenus?: Submenu[]
}

type Group = {
  groupLabel: string
  menus: Menu[]
}

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: '',
      menus: [
        {
          href: '/dashboard',
          label: 'Dashboard',
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: 'Contents',
      menus: [
        {
          href: '',
          label: 'Admin',
          icon: ShieldEllipsis,
          submenus: [
            {
              href: '/admin/branch',
              label: 'Branch',
            },
            {
              href: '/admin/roles',
              label: 'Roles',
            },
            {
              href: '/warehouse',
              label: 'Warehouse',
            },
          ],
        },
        {
          href: '',
          label: 'Products',
          icon: Package,
          submenus: [
            {
              href: '/products',
              label: 'Products',
            },
            {
              href: '/products/group',
              label: 'Product Group',
            },
            {
              href: '/products/unit',
              label: 'Product Unit',
            },
          ],
        },
        {
          href: '',
          label: 'Purchase',
          icon: BaggageClaim,
          submenus: [
            {
              href: '/purchase/supplier',
              label: 'Supplier',
            },
            {
              href: '/purchase/requisition',
              label: 'Requisition',
            },
            {
              href: '/purchase/order',
              label: 'Order',
            },
            {
              href: '/purchase/challan',
              label: 'Challan',
            },
            {
              href: '/purchase/invoice',
              label: 'Invoice',
            },
            {
              href: '/purchase/return',
              label: 'Return',
            },
          ],
        },

        {
          href: '/sales',
          label: 'Sales',
          icon: Layers2,
        },
        {
          href: '/production',
          label: 'Production',
          icon: Bolt,
        },

        {
          href: '',
          label: 'Reports',
          icon: NotebookText,
          submenus: [
            {
              href: '/report/sales',
              label: 'Sales Report',
            },
            {
              href: '/report/order',
              label: 'Order Report',
            },
            {
              href: '/report/production',
              label: 'Production Report',
            },
          ],
        },
      ],
    },
    {
      groupLabel: 'Settings',
      menus: [
        {
          href: '/users',
          label: 'Users',
          icon: Users,
        },
        {
          href: '/setting',
          label: 'Settings',
          icon: Settings,
        },
      ],
    },
  ]
}

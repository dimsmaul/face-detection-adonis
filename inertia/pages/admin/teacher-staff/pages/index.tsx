import React from 'react'
import { DataTable } from '~/components/table'
import { IAdminResponse } from '../types/types'
import InputSearchDebounce from '~/components/search'
import { router } from '@inertiajs/react'
import { Button } from '~/components/ui/button'
import { Eclipse, Ellipsis, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

const AdminTeacherPages: React.FC<IAdminResponse> = (props) => {
  const [search, setSearch] = React.useState<string>('')
// const navigate = useNavi
  const meta = props.data?.meta
  const data = props.data?.data

  const handleSearch = (val: string) => {
    setSearch(val)
    // Gunakan Inertia untuk navigasi dengan parameter search
    router.get(
      '/admin/teachers-staff',
      {
        search: val,
        page: 1,
      },
      {
        preserveState: true,
        replace: true,
      }
    )
  }

  const handlePaginationChange = (page: number, limit: number) => {
    router.get(
      '/admin/teachers-staff',
      {
        search: search,
        page: page,
        limit: limit,
      },
      {
        preserveState: true,
        replace: true,
      }
    )
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Teacher Staff</h1>
        <div className="flex flex-row gap-2">
          <InputSearchDebounce defaultValue={search} onChange={handleSearch} />
          <Button size={'icon'} onClick={() => router.visit('/admin/teachers-staff/action')}>
            <Plus />
          </Button>
        </div>
      </div>
      <div>
        <DataTable
          columns={[
            {
              accessorKey: 'id',
              header: 'No',
              cell: ({ row }) => <div>{row.index + 1}</div>,
            },
            {
              accessorKey: 'nip',
              header: 'NIP',
            },
            {
              accessorKey: 'name',
              header: 'Name',
            },
            {
              accessorKey: 'email',
              header: 'Email',
            },
            {
              accessorKey: 'id',
              header: 'Actions',
              cell: ({ row }) => {
                // const id = row.getValue('id')
                return (
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button size={'icon'} variant={'outline'}>
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              },
            },
          ]}
          data={data || []}
          pageCount={meta?.lastPage || 1}
          pagination={{
            page: meta?.currentPage || 1,
            limit: meta?.perPage || 10,
          }}
          onPaginationChange={(page, limit) => {
            handlePaginationChange(page, limit)
          }}
        />
      </div>
    </div>
  )
}

export default AdminTeacherPages

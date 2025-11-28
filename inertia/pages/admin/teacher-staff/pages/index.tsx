import React from 'react'
import { DataTable } from '~/components/table'
import { IAdminResponse } from '../types/types'
import InputSearchDebounce from '~/components/search'
import { router } from '@inertiajs/react'
import { Button } from '~/components/ui/button'
import { Delete, Edit, Plus, Trash } from 'lucide-react'
import { confirmAPIForm } from '~/components/alert'
import axios from 'axios'

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

  const handleDelete = (id: string) => {
    confirmAPIForm({
      callAPI: () => axios.delete(`/admin/teachers-staff/${id}`),
      onAlertSuccess: () => router.reload({ only: ['data'] }),
    })
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
                  <div className="flex flex-row gap-2">
                    <Button
                      size={'sm'}
                      variant={'outline'}
                      onClick={() =>
                        router.visit(`/admin/teachers-staff/action/${row.original.id}`)
                      }
                    >
                      <Edit />
                    </Button>
                    <Button
                      size={'sm'}
                      variant={'destructive'}
                      onClick={() => handleDelete(row.original.id)}
                    >
                      <Trash />
                    </Button>
                  </div>
                  // <DropdownMenu>
                  //   <DropdownMenuTrigger>
                  //     <Button size={'icon'} variant={'outline'}>
                  //       <Ellipsis />
                  //     </Button>
                  //   </DropdownMenuTrigger>
                  //   <DropdownMenuContent>
                  //     <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  //     <DropdownMenuSeparator />
                  //     <DropdownMenuItem
                  //       onClick={() => {
                  //         router.visit('/admin/teachers-staff/action/' + row.getValue('id'))
                  //       }}
                  //     >
                  //       Edit
                  //     </DropdownMenuItem>
                  //     <DropdownMenuItem>Delete</DropdownMenuItem>
                  //   </DropdownMenuContent>
                  // </DropdownMenu>
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

import React from 'react'
import { DataTable } from '~/components/table'
import InputSearchDebounce from '~/components/search'
import { router } from '@inertiajs/react'
import { Button } from '~/components/ui/button'
import { Ellipsis, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { IAdminPositionResponse } from '../types/types'
import { confirmAPIForm } from '~/components/alert'
import axios from 'axios'

const PositionPages: React.FC<IAdminPositionResponse> = (props) => {
  const [search, setSearch] = React.useState<string>('')
  const meta = props.data?.meta
  const data = props.data?.data

  const handleSearch = (val: string) => {
    setSearch(val)
    router.get(
      '/admin/positions',
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
      '/admin/positions',
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
      callAPI: () => axios.delete('/api/positions/' + id),
      onAlertSuccess: () => {
        router.get('/admin/positions', {
          search: search,
          page: meta.currentPage,
        })
      },
    })
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Positions</h1>
        <div className="flex flex-row gap-2">
          <InputSearchDebounce defaultValue={search} onChange={handleSearch} />
          <Button size={'icon'} onClick={() => router.visit('/admin/positions/action')}>
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
              accessorKey: 'name',
              header: 'Name',
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
                      <DropdownMenuItem
                        onClick={() =>
                          router.visit(`/admin/positions/action/${row.getValue('id')}`)
                        }
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(row.getValue('id'))}>
                        Delete
                      </DropdownMenuItem>
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

export default PositionPages

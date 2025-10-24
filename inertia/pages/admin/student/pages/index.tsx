import React from 'react'
import { IStudentResponse } from '../types/types'
import { router } from '@inertiajs/react'
import { DataTable } from '~/components/table'
import InputSearchDebounce from '~/components/search'
import { Button } from '~/components/ui/button'
import { Edit, Plus } from 'lucide-react'

const StudentPages: React.FC<IStudentResponse> = (props) => {
  const [search, setSearch] = React.useState<string>('')

  const meta = props.data?.meta
  const data = props.data?.data

  const handleSearch = (val: string) => {
    setSearch(val)
    router.get(
      '/admin/students',
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
      '/admin/students',
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
        <h1 className="text-xl font-semibold">Students</h1>
        <div className="flex flex-row gap-2">
          <InputSearchDebounce defaultValue={search} onChange={handleSearch} />
          <Button size={'icon'} onClick={() => router.visit('/admin/students/action')}>
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
              accessorKey: 'nim',
              header: 'NIM',
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
              accessorKey: 'major',
              header: 'Major',
            },
            {
              accessorKey: 'id',
              header: 'Action',
              cell: ({ row }) => (
                <div>
                  <Button
                    size={'sm'}
                    variant={'outline'}
                    onClick={() => router.visit(`/admin/students/action/${row.original.id}`)}
                  >
                    <Edit />
                  </Button>
                </div>
              ),
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

export default StudentPages

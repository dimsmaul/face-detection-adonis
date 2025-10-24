import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type PaginationProps = {
  type: 'infinite-handle' | 'button-handle'
  page: number
  limit: number
  totalPages: number
  totalRecord: number
}

type ListProps<T> = {
  data: T[]
  field?: (keyof T)[]
  type?: 'card' | 'list'
  pagination?: PaginationProps
  handleNextPage?: () => void
  renderItem?: (item: T, index: number) => React.ReactNode
}

export function List<T>({
  data,
  field,
  type = 'list',
  pagination,
  handleNextPage,
  renderItem,
}: ListProps<T>) {
  return (
    <div className={cn('w-full space-y-4')}>
      {/* Render Items */}
      <div
        className={cn(
          type === 'card'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
            : 'flex flex-col divide-y gap-4'
        )}
      >
        {data.map((item, index) =>
          renderItem ? (
            renderItem(item, index)
          ) : (
            <div
              key={index}
              className={cn(
                type === 'card'
                  ? 'p-4 rounded-xl shadow bg-white'
                  : 'py-2 px-3 hover:bg-muted/50 transition-all duration-150'
              )}
            >
              {field
                ? field.map((f, i) => (
                    <div key={i} className="text-sm">
                      <span className="font-medium">{String(f)}:</span> {String(item[f])}
                    </div>
                  ))
                : JSON.stringify(item)}
            </div>
          )
        )}
      </div>

      {/* Pagination */}
      {pagination && handleNextPage && (
        <div className="flex justify-center mt-4">
          {pagination.type === 'button-handle' && pagination.page < pagination.totalPages && (
            <Button onClick={handleNextPage}>Load More</Button>
          )}

          {pagination.type === 'infinite-handle' && pagination.page < pagination.totalPages && (
            <div
              onClick={handleNextPage}
              className="cursor-pointer text-blue-500 text-sm hover:underline"
            >
              Scroll to load more...
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// import { CellContext, Column, ColumnDefTemplate } from '@tanstack/react-table'
// import { Button } from '@/components/ui/button'
// import Preview from '../preview'
// import { cn } from '~/lib/utils'

// export interface CustomColumnProps<T, V> {
//   header: string
//   accessorKey: keyof T
//   cell?: ColumnDefTemplate<CellContext<T, V>>
// }

// interface DataListProps<TData, TValue> {
//   columns: CustomColumnProps<TData, TValue>[]
//   data: TData[]
//   handleLoadMore?: () => void
//   isLoading?: boolean
//   emptyMessage?: string
//   itemClassName?: string
// }

// export function DataList<TData, TValue>({
//   columns,
//   data,
//   handleLoadMore,
//   isLoading = false,
//   emptyMessage = 'No data available.',
//   itemClassName,
// }: DataListProps<TData, TValue>) {
//   return (
//     <div className="space-y-3">
//       {/* List */}
//       {isLoading ? (
//         <>
//           {Array.from({ length: 5 }).map((_, index) => (
//             <div
//               key={index}
//               className="rounded-xl border p-4 bg-muted/20 animate-pulse flex flex-col gap-2"
//             >
//               <div className="h-4 w-1/3 bg-muted rounded" />
//               <div className="h-4 w-2/3 bg-muted rounded" />
//               <div className="h-4 w-1/2 bg-muted rounded" />
//             </div>
//           ))}
//         </>
//       ) : data.length > 0 ? (
//         data.map((item, index) => (
//           <div
//             key={index}
//             className={cn(
//               'rounded-xl border p-4 grid grid-cols-4 justify-between bg-card shadow-sm hover:shadow-md transition-all duration-200',
//               itemClassName
//             )}
//           >
//             {columns?.map((col, index) => {
//               return (
//                 <Preview label={col.header} key={index}>
//                   {col.cell
//                     ? typeof col.cell === 'function'
//                       ? col.cell({
//                           getValue: () => (item as any)[col.accessorKey as string],
//                           row: { original: item },
//                           column: {} as Column<TData, TValue>,
//                         })
//                       : col.cell
//                     : (item as any)[col.accessorKey as string]}
//                 </Preview>
//               )
//             })}
//             {/* {columns.map((column) => {
//               const label =
//                 typeof column.header === 'function'
//                   ? flexRender(column.header, { column })
//                   : column.header

//               const value = flexRender(column.cell, {
//                 getValue: () => (item as any)[column.accessorKey as string],
//                 row: { original: item },
//                 column,
//               })

//               return (
//                 <div key={column.id ?? column.accessorKey} className="flex justify-between py-1">
//                   <span className="text-sm text-muted-foreground">{label}</span>
//                   <span className="text-sm font-medium">{value}</span>
//                 </div>
//               )
//             })} */}
//           </div>
//         ))
//       ) : (
//         <div className="text-center py-10 text-muted-foreground text-sm">{emptyMessage}</div>
//       )}

//       {/* Load More */}
//       {handleLoadMore && !isLoading && data.length > 0 && (
//         <div className="flex justify-center pt-4">
//           <Button onClick={handleLoadMore} variant="outline">
//             Load more
//           </Button>
//         </div>
//       )}
//     </div>
//   )
// }

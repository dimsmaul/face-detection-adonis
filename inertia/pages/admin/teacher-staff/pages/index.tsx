import React from 'react'
import axios from 'axios'
import { useInfiniteQuery } from '@tanstack/react-query'

const AdminTeacherStaff: React.FC = (props) => {
  const list = useInfiniteQuery({
    queryKey: ['teacher-staff-list'],
    queryFn: async ({ pageParam = 1 }) => getList({ page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.current_page < lastPage.data.last_page) {
        return lastPage.data.current_page + 1
      }
      return undefined
    },
    initialPageParam: 1,
  })

  return <div>{JSON.stringify(list.data)}</div>
}

export default AdminTeacherStaff

const getList = async ({ page }: { page: number }) => {
  const data = await axios.get('/api/admin/', {
    withCredentials: true,
    headers: {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest', // Penting untuk Adonis
    },
    params: {
      page,
    },
  })
  return data.data
}

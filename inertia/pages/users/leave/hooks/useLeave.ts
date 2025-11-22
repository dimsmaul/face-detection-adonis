import { router } from '@inertiajs/react'
import axios from 'axios'
import { confirmAPIForm } from '~/components/alert'

export const useLeave = () => {
  const handleDelete = async (id: string) => {
    confirmAPIForm({
      callAPI: () => axios.delete(`/api/permits/${id}`),
      title: 'Delete Leave',
      message: 'Are you sure you want to delete this leave?',
      onAlertSuccess: () => {
        console.log('Leave deleted successfully')
        router.reload()
      },
    })
  }

  return {
    handleDelete,
  }
}

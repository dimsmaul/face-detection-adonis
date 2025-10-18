import { Inertia } from '@inertiajs/inertia'
import React, { useEffect } from 'react'
import axios from 'axios'

const AdminTeacherStaff: React.FC = (props) => {
  // const getData = async () => {
  //   const data = await axios.get('/api/admin/teachers-staff/', {
  //     withCredentials: true,
  //   })
  //   console.log(data)
  // }

  // useEffect(() => {
  //   getData()
  // }, [])

  return <div>
    {JSON.stringify(props)}
  </div>
}

export default AdminTeacherStaff

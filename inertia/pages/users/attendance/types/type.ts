interface AttendanceResponse {
  data: AttendanceListType[]
}

interface AttendanceListType {
  id: null
  date: string
  status: number
  time: null
  timeOut: null
  note: null
}

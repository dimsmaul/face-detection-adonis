import { Meta } from '../../teacher-staff/types/types'

export interface ScheduleType {
  meta: Meta
  data: ScheduleTypeDatum[]
}

export interface ScheduleTypeDatum {
  id: number
  date: Date
  time: string
  type: string
  createdAt: Date
  updatedAt: null
}

export interface ScheduleDetailType {
  id: string
  nim: null | string
  name: string
  email: string
  major: null | string
  status: number | null
  dateOfAcceptance: Date | null
  profile: null | string
  userDataId: null | string
  createdAt: Date
  updatedAt: Date
  deletedAt: null
  attendances: ScheduleDetailTypeAttendance[]
}

export interface ScheduleDetailTypeAttendance {
  id: string
  date: Date
  time: string
  timeOut: null
  note: string
  status: number
  userId: string
  createdAt: Date
  updatedAt: Date
}

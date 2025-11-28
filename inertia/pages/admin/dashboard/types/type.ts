export interface AdminDashboardProps {
  permit: LeaveData[]
  compare: AdminDashboardPropsCompare
  monthlyData: AdminDashboardPropsMonthlyDatum[]
}

export interface AdminDashboardPropsCompare {
  present: number
  leave: number
  absent: number
}

export interface AdminDashboardPropsMonthlyDatum {
  month: number
  count: number
}

export interface AdminDashboardPropsPermit {
  id: string
  userId: string
  date: Date
  time: string
  note: string
  attachment: string
  createdAt: Date
  updatedAt: Date
  user: AdminDashboardPropsUser
}

export interface AdminDashboardPropsUser {
  id: string
  nim: string
  name: string
  email: string
  major: null
  status: number
  dateOfAcceptance: null
  profile: string
  userDataId: string
  createdAt: Date
  updatedAt: Date
  deletedAt: null
}

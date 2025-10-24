import { Meta } from '../../teacher-staff/types/types'

export interface IStudentResponse {
  data: IStudentResponseData
}

export interface IStudentResponseData {
  meta: Meta
  data: IStudentResponseDatum[]
}

export interface IStudentResponseDatum {
  id: string
  nim: null
  name: string
  email: string
  major: null
  status: null
  dateOfAcceptance: null
  profile: null
  userDataId: null
  createdAt: string
  updatedAt: string
  deletedAt: null
  userData: null
}
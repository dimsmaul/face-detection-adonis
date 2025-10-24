import { Meta } from "../../teacher-staff/types/types"

export interface IAdminPositionResponse {
  data: IAdminPositionResponseData
}

export interface IAdminPositionResponseData {
  meta: Meta
  data: IAdminPositionResponseDatum[]
}

export interface IAdminPositionResponseDatum {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface IAdminResponse {
  data: IAdminResponseData
}

export interface IAdminResponseData {
  meta: Meta
  data: IAdminResponseDatum[]
}

export interface IAdminResponseDatum {
  id: string
  nip: null
  name: string
  email: string
  subject: null
  status: null
  profile: null
  positionId: null
  userDataId: null
  createdAt: string
  updatedAt: string
  position: null
  userData: null
}

export interface Meta {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  firstPage: number
  firstPageUrl: string
  lastPageUrl: string
  nextPageUrl: null
  previousPageUrl: null
}

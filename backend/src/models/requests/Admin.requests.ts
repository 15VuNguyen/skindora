import { FilterBrandState, Role, UserVerifyStatus } from '~/constants/enums'
export interface createNewFilterBrandReqBody {
  option_name: string
  category_name: string
  category_param: string
  state?: FilterBrandState
}
export interface UpdateUserStateReqBody {
  verify: UserVerifyStatus
}

export interface createNewFilterBrandReqBody {
  option_name: string
  category_name: string
  category_param: string
  state?: FilterBrandState
}

export interface updateFilterBrandReqBody {
  option_name: string
  category_name: string
  category_param: string
}

export interface disableFilterBrandReqBody {
  state: FilterBrandState
}

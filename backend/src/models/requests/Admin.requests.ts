import { FilterBrandState, GenericFilterState, Role, UserVerifyStatus } from '~/constants/enums'
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

export interface createNewFilterDacTinhReqBody {
  option_name: string
  category_name: string
  category_param: string
  state?: GenericFilterState
}

export interface updateFilterDacTinhReqBody {
  option_name?: string
  category_name?: string
  category_param?: string
}

export interface disableFilterDacTinhReqBody {
  state: GenericFilterState
}

export interface createNewFilterHskIngredientReqBody {
  option_name: string
  category_name: string
  category_param: string
  state?: GenericFilterState
}

export interface updateFilterHskIngredientReqBody {
  option_name?: string
  category_name?: string
  category_param?: string
}

export interface disableFilterHskIngredientReqBody {
  state: GenericFilterState
}

export interface createNewFilterHskProductTypeReqBody {
  option_name: string
  description?: string
  category_name: string
  category_param: string
  state?: GenericFilterState
}

export interface updateFilterHskProductTypeReqBody {
  option_name?: string
  description?: string
  category_name?: string
  category_param?: string
}

export interface disableFilterHskProductTypeReqBody {
  state: GenericFilterState
}

export interface createNewFilterHskSizeReqBody {
  option_name: string
  category_name: string
  category_param: string
  state?: GenericFilterState
}

export interface updateFilterHskSizeReqBody {
  option_name?: string
  category_name?: string
  category_param?: string
}

export interface disableFilterHskSizeReqBody {
  state: GenericFilterState
}

export interface createNewFilterHskSkinTypeReqBody {
  option_name: string
  category_name: string
  category_param: string
  state?: GenericFilterState
}

export interface updateFilterHskSkinTypeReqBody {
  option_name?: string
  category_name?: string
  category_param?: string
}

export interface disableFilterHskSkinTypeReqBody {
  state: GenericFilterState
}

export interface createNewFilterHskUsesReqBody {
  option_name: string
  category_name: string
  category_param: string
  state?: GenericFilterState
}

export interface updateFilterHskUsesReqBody {
  option_name?: string
  category_name?: string
  category_param?: string
}

export interface disableFilterHskUsesReqBody {
  state: GenericFilterState
}

export interface createNewFilterHskOriginReqBody {
  option_name: string
  category_name: string
  category_param: string
  state?: GenericFilterState
}

export interface updateFilterHskOriginReqBody {
  option_name?: string
  category_name?: string
  category_param?: string
}

export interface disableFilterHskOriginReqBody {
  state: GenericFilterState
}

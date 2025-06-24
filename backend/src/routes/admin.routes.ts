import { Router } from 'express'
import {
  createNewFilterBrandController,
  getAllUserController,
  getUserDetailController,
  updateProductController,
  updateProductStateController,
  updateUserStateController
} from '~/controllers/admin.controllers'
import {
  createNewProductController,
  getAllProductController,
  getProductDetailController
} from '~/controllers/products.controllers'
import {
  createNewFilterBrandValidator,
  createNewProductValidator,
  isAdminValidator,
  isValidToActiveValidator,
  updateProductStateValidator,
  updateProductValidator,
  updateUserStateValidator
} from '~/middlewares/admin.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'
import {
  createVoucherController,
  updateVoucherController,
  inactiveVoucherController,
  getAllVoucherForAdminController
} from '~/controllers/voucher.controllers'
import { filterMiddleware, paginationValidator, parseDateFieldsMiddleware } from '~/middlewares/common.middlewares'
import { createVoucherValidator, updateVoucherValidator, voucherIdValidator } from '~/middlewares/voucher.middlewares'
import { CreateNewVoucherReqBody, UpdateVoucherReqBody } from '~/models/requests/Vouchers.request'
import { updateProductReqBody } from '~/models/requests/Product.requests'
import { disableFilterBrandController, getAllFilterBrandsController, getFilterBrandByIdController, updateFilterBrandController } from '~/controllers/filterBrand.controllers'
import { disableFilterBrandReqBody, updateFilterBrandReqBody } from '~/models/requests/Admin.requests'
import { disableFilterBrandValidator, getFilterBrandByIdValidator, updateFilterBrandValidator } from '~/middlewares/filterBrand.middlewares'

const adminRouter = Router()
//user management
adminRouter.get('/manage-users/get-all', accessTokenValidator, isAdminValidator, wrapAsync(getAllUserController))
adminRouter.get('/manage-users/:_id', accessTokenValidator, isAdminValidator, wrapAsync(getUserDetailController))
adminRouter.put(
  '/manage-users/update-user-states/:id',
  accessTokenValidator,
  isAdminValidator,
  updateUserStateValidator,
  wrapAsync(updateUserStateController)
)
//voucher management
adminRouter.get(
  '/manage-vouchers/get-all',
  accessTokenValidator,
  isAdminValidator,
  wrapAsync(getAllVoucherForAdminController)
)
adminRouter.post(
  '/manage-vouchers',
  accessTokenValidator,
  isAdminValidator,
  filterMiddleware<CreateNewVoucherReqBody>([
    'code',
    'description',
    'discountType',
    'discountValue',
    'startDate',
    'endDate',
    'maxDiscountAmount',
    'minOrderValue',
    'usageLimit',
    'userUsageLimit'
  ]),
  parseDateFieldsMiddleware(['startDate', 'endDate']),
  createVoucherValidator,
  wrapAsync(createVoucherController)
)
adminRouter.put(
  '/manage-vouchers/:voucherId',
  accessTokenValidator,
  isAdminValidator,
  voucherIdValidator,
  parseDateFieldsMiddleware(['endDate']),
  filterMiddleware<UpdateVoucherReqBody>([
    'description',
    'discountType',
    'discountValue',
    'endDate',
    'maxDiscountAmount',
    'minOrderValue',
    'usageLimit',
    'userUsageLimit'
  ]),
  updateVoucherValidator,
  wrapAsync(updateVoucherController)
)
adminRouter.put(
  '/manage-vouchers/:voucherId/status',
  accessTokenValidator,
  isAdminValidator,
  voucherIdValidator,
  isValidToActiveValidator,
  wrapAsync(inactiveVoucherController)
)

//product management
adminRouter.get('/manage-products/get-all', accessTokenValidator, isAdminValidator, paginationValidator, wrapAsync(getAllProductController))
adminRouter.post(
  '/manage-products/create-new-product',
  accessTokenValidator,
  isAdminValidator,
  createNewProductValidator,
  wrapAsync(createNewProductController)
)
adminRouter.get('/manage-products/:_id', accessTokenValidator, isAdminValidator, wrapAsync(getProductDetailController))
adminRouter.put(
  '/manage-products/update/:_id',
  accessTokenValidator,
  isAdminValidator,
  filterMiddleware<updateProductReqBody>([
    'name_on_list',
    'engName_on_list',
    'price_on_list',
    'image_on_list',
    'hover_image_on_list',
    'productName_detail',
    'engName_detail',
    'description_detail',
    'ingredients_detail',
    'guide_detail',
    'specification_detail',
    'main_images_detail',
    'sub_images_detail',
    'filter_brand',
    'filter_dac_tinh',
    'filter_hsk_ingredients',
    'filter_hsk_product_type',
    'filter_hsk_size',
    'filter_hsk_skin_type',
    'filter_hsk_uses',
    'filter_origin',
    'quantity',
    'state'
  ]),
  updateProductValidator,
  wrapAsync(updateProductController)
)
adminRouter.put(
  '/manage-products/update-state/:_id',
  accessTokenValidator,
  isAdminValidator,
  updateProductStateValidator,
  wrapAsync(updateProductStateController)
)

//manage filter
//filter-brand
adminRouter.post(
  '/manage-filters/create-new-filter-brand',
  accessTokenValidator,
  isAdminValidator,
  createNewFilterBrandValidator,
  wrapAsync(createNewFilterBrandController)
)
//get all filter brands
adminRouter.get(
  '/manage-filters/get-all-filter-brands',
  accessTokenValidator,
  isAdminValidator,
  wrapAsync(getAllFilterBrandsController)
)
//update filter brand
adminRouter.put(
  '/manage-filters/update-filter-brand/:_id',
  accessTokenValidator,
  isAdminValidator,
  filterMiddleware<updateFilterBrandReqBody>(['option_name', 'category_name', 'category_param']),
  updateFilterBrandValidator,
  wrapAsync(updateFilterBrandController)
)
//disable filter brand
adminRouter.put(
  '/manage-filters/update-filter-brand-state/:_id',
  accessTokenValidator,
  isAdminValidator,
  filterMiddleware<disableFilterBrandReqBody>(['state']),
  disableFilterBrandValidator,
  wrapAsync(disableFilterBrandController)
)
//get filter brand by id
adminRouter.get(
  '/manage-filters/get-filter-brand-detail/:_id',
  accessTokenValidator,
  isAdminValidator,
  getFilterBrandByIdValidator,
  wrapAsync(getFilterBrandByIdController)
)

export default adminRouter

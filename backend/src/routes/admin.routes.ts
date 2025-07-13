import { Router } from 'express'
import {
  adminSearchProductsByNameController,
  createNewFilterBrandController,
  getAllUserController,
  getBannedUsersController,
  getLowStockProductsController,
  getOnSaleProductsController,
  getOutOfStockProductsController,
  getUnverifiedUsersController,
  getUserDetailController,
  getVerifiedUsersController,
  updateProductController,
  updateProductStateController,
  updateUserStateController
} from '~/controllers/admin.controllers'
import {
  createNewProductController,
  getAllProductController,
  getProductDetailController,
  getProductStatsController
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
  getAllVoucherForAdminController,
  getVoucherDetailController
} from '~/controllers/voucher.controllers'
import {
  filterMiddleware,
  paginationValidator,
  parseDateFieldsMiddleware,
  searchFilterOptionNameValidator
} from '~/middlewares/common.middlewares'
import { createVoucherValidator, updateVoucherValidator, voucherIdValidator } from '~/middlewares/voucher.middlewares'
import { CreateNewVoucherReqBody, UpdateVoucherReqBody } from '~/models/requests/Vouchers.request'
import { getOrderRevenueController } from '~/controllers/orders.controllers'
import { getOrderRevenueValidator } from '~/middlewares/orders.middlewares'
import { updateProductReqBody } from '~/models/requests/Product.requests'
import {
  disableFilterBrandController,
  getActiveFilterBrandsController,
  getAllFilterBrandsController,
  getFilterBrandByIdController,
  searchFilterBrandsController,
  updateFilterBrandController
} from '~/controllers/filterBrand.controllers'
import {
  disableFilterBrandReqBody,
  disableFilterDacTinhReqBody,
  disableFilterHskIngredientReqBody,
  disableFilterHskOriginReqBody,
  disableFilterHskProductTypeReqBody,
  disableFilterHskSizeReqBody,
  disableFilterHskSkinTypeReqBody,
  disableFilterHskUsesReqBody,
  updateFilterBrandReqBody,
  updateFilterDacTinhReqBody,
  updateFilterHskIngredientReqBody,
  updateFilterHskOriginReqBody,
  updateFilterHskProductTypeReqBody,
  updateFilterHskSizeReqBody,
  updateFilterHskSkinTypeReqBody,
  updateFilterHskUsesReqBody
} from '~/models/requests/Admin.requests'
import {
  disableFilterBrandValidator,
  getFilterBrandByIdValidator,
  updateFilterBrandValidator
} from '~/middlewares/filterBrand.middlewares'
import {
  createNewFilterDacTinhValidator,
  disableFilterDacTinhValidator,
  getFilterDacTinhByIdValidator,
  updateFilterDacTinhValidator
} from '~/middlewares/filterDacTinh.middlewares'
import {
  createNewFilterDacTinhController,
  disableFilterDacTinhController,
  getActiveFilterDacTinhsController,
  getAllFilterDacTinhsController,
  getFilterDacTinhByIdController,
  searchFilterDacTinhsController,
  updateFilterDacTinhController
} from '~/controllers/filterDacTinh.controllers'
import {
  createNewFilterHskIngredientController,
  disableFilterHskIngredientController,
  getActiveFilterHskIngredientsController,
  getAllFilterHskIngredientsController,
  getFilterHskIngredientByIdController,
  searchFilterHskIngredientsController,
  updateFilterHskIngredientController
} from '~/controllers/filterHskIngredient.controllers'
import {
  createNewFilterHskIngredientValidator,
  disableFilterHskIngredientValidator,
  getFilterHskIngredientByIdValidator,
  updateFilterHskIngredientValidator
} from '~/middlewares/filterHskIngredient.middlewares'
import {
  createNewFilterHskProductTypeController,
  disableFilterHskProductTypeController,
  getActiveFilterHskProductTypesController,
  getAllFilterHskProductTypesController,
  getFilterHskProductTypeByIdController,
  searchFilterHskProductTypesController,
  updateFilterHskProductTypeController
} from '~/controllers/filterHskProductType.controllers'
import {
  createNewFilterHskProductTypeValidator,
  disableFilterHskProductTypeValidator,
  getFilterHskProductTypeByIdValidator,
  updateFilterHskProductTypeValidator
} from '~/middlewares/filterHskProductType.middlewares'
import {
  createNewFilterHskSizeController,
  disableFilterHskSizeController,
  getActiveFilterHskSizesController,
  getAllFilterHskSizesController,
  getFilterHskSizeByIdController,
  searchFilterHskSizesController,
  updateFilterHskSizeController
} from '~/controllers/filterHskSize.controllers'
import {
  createNewFilterHskSizeValidator,
  disableFilterHskSizeValidator,
  getFilterHskSizeByIdValidator,
  updateFilterHskSizeValidator
} from '~/middlewares/filterHskSize.middlewares'
import {
  createNewFilterHskSkinTypeController,
  disableFilterHskSkinTypeController,
  getActiveFilterHskSkinTypesController,
  getAllFilterHskSkinTypesController,
  getFilterHskSkinTypeByIdController,
  searchFilterHskSkinTypesController,
  updateFilterHskSkinTypeController
} from '~/controllers/filterHskSkinType.controllers'
import {
  createNewFilterHskSkinTypeValidator,
  disableFilterHskSkinTypeValidator,
  getFilterHskSkinTypeByIdValidator,
  updateFilterHskSkinTypeValidator
} from '~/middlewares/filterHskSkinType.middlewares'
import {
  createNewFilterHskUsesController,
  disableFilterHskUsesController,
  getActiveFilterHskUsesController,
  getAllFilterHskUsesController,
  getFilterHskUsesByIdController,
  searchFilterHskUsesController,
  updateFilterHskUsesController
} from '~/controllers/filterHskUses.controllers'
import {
  createNewFilterHskUsesValidator,
  disableFilterHskUsesValidator,
  getFilterHskUsesByIdValidator,
  updateFilterHskUsesValidator
} from '~/middlewares/filterHskUses.middlewares'
import {
  createNewFilterHskOriginController,
  disableFilterHskOriginController,
  getActiveFilterHskOriginsController,
  getAllFilterHskOriginsController,
  getFilterHskOriginByIdController,
  searchFilterHskOriginsController,
  updateFilterHskOriginController
} from '~/controllers/filterHskOrigin.controllers'
import {
  createNewFilterHskOriginValidator,
  disableFilterHskOriginValidator,
  getFilterHskOriginByIdValidator,
  updateFilterHskOriginValidator
} from '~/middlewares/filterHskOrigin.middlewares'

const adminRouter = Router()
//user management
adminRouter.get('/manage-users/get-all', accessTokenValidator, isAdminValidator, wrapAsync(getAllUserController))
adminRouter.get(
  '/manage-users/unverified',
  accessTokenValidator,
  isAdminValidator,
  paginationValidator,
  wrapAsync(getUnverifiedUsersController)
)

adminRouter.get(
  '/manage-users/verified',
  accessTokenValidator,
  isAdminValidator,
  paginationValidator,
  wrapAsync(getVerifiedUsersController)
)

adminRouter.get(
  '/manage-users/banned',
  accessTokenValidator,
  isAdminValidator,
  paginationValidator,
  wrapAsync(getBannedUsersController)
)
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
adminRouter.get(
  '/manage-voucher/:voucherId',
  accessTokenValidator,
  isAdminValidator,
  voucherIdValidator,
  wrapAsync(getVoucherDetailController)
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
adminRouter.get('/manage-products/stats', accessTokenValidator, isAdminValidator, wrapAsync(getProductStatsController))
adminRouter.get(
  '/manage-products/get-all',
  accessTokenValidator,
  isAdminValidator,
  paginationValidator,
  wrapAsync(getAllProductController)
)
adminRouter.get(
  '/manage-products/search-by-name',
  accessTokenValidator,
  isAdminValidator,
  paginationValidator,
  searchFilterOptionNameValidator,
  wrapAsync(adminSearchProductsByNameController)
)
adminRouter.get(
  '/manage-products/on-sale',
  accessTokenValidator,
  isAdminValidator,
  paginationValidator,
  wrapAsync(getOnSaleProductsController)
)

adminRouter.get(
  '/manage-products/low-stock',
  accessTokenValidator,
  isAdminValidator,
  paginationValidator,
  wrapAsync(getLowStockProductsController)
)

adminRouter.get(
  '/manage-products/out-of-stock',
  accessTokenValidator,
  isAdminValidator,
  paginationValidator,
  wrapAsync(getOutOfStockProductsController)
)
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

//manage order revenue
adminRouter.get(
  '/manage-orders/revenue',
  accessTokenValidator,
  isAdminValidator,
  getOrderRevenueValidator,
  wrapAsync(getOrderRevenueController)
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

adminRouter.get(
  '/manage-filters/search-filter-brand',
  accessTokenValidator,
  isAdminValidator,
  searchFilterOptionNameValidator,
  wrapAsync(searchFilterBrandsController)
)

//FILTER DAC TINH
//Tạo mới một đặc tính
adminRouter.post(
  '/manage-filters/create-new-filter-dac-tinh',
  accessTokenValidator,
  isAdminValidator,
  createNewFilterDacTinhValidator,
  wrapAsync(createNewFilterDacTinhController)
)

// Lấy danh sách tất cả đặc tính
adminRouter.get(
  '/manage-filters/get-all-filter-dac-tinh',
  accessTokenValidator,
  isAdminValidator,
  wrapAsync(getAllFilterDacTinhsController)
)

//Cập nhật thông tin một "đặc tính"
adminRouter.put(
  '/manage-filters/update-filter-dac-tinh/:_id',
  accessTokenValidator,
  isAdminValidator,
  filterMiddleware<updateFilterDacTinhReqBody>(['option_name', 'category_name', 'category_param']),
  updateFilterDacTinhValidator,
  wrapAsync(updateFilterDacTinhController)
)

//Cập nhật trạng thái (active/inactive) của một "đặc tính"
adminRouter.put(
  '/manage-filters/update-filter-dac-tinh-state/:_id',
  accessTokenValidator,
  isAdminValidator,
  filterMiddleware<disableFilterDacTinhReqBody>(['state']),
  disableFilterDacTinhValidator,
  wrapAsync(disableFilterDacTinhController)
)

//Lấy chi tiết một "đặc tính" bằng ID
adminRouter.get(
  '/manage-filters/get-filter-dac-tinh-detail/:_id',
  accessTokenValidator,
  isAdminValidator,
  getFilterDacTinhByIdValidator,
  wrapAsync(getFilterDacTinhByIdController)
)

adminRouter.get(
  '/manage-filters/search-filter-dac-tinh',
  accessTokenValidator,
  isAdminValidator,
  searchFilterOptionNameValidator,
  wrapAsync(searchFilterDacTinhsController)
)

//ingredient filter
adminRouter.get(
  '/manage-filters/get-all-filter-hsk-ingredients',
  accessTokenValidator,
  isAdminValidator,
  wrapAsync(getAllFilterHskIngredientsController)
)

adminRouter.post(
  '/manage-filters/create-new-filter-hsk-ingredient',
  accessTokenValidator,
  isAdminValidator,
  createNewFilterHskIngredientValidator,
  wrapAsync(createNewFilterHskIngredientController)
)

adminRouter.get(
  '/manage-filters/search-filter-hsk-ingredient',
  accessTokenValidator,
  isAdminValidator,
  searchFilterOptionNameValidator,
  wrapAsync(searchFilterHskIngredientsController)
)

adminRouter.get(
  '/manage-filters/get-filter-hsk-ingredient-detail/:_id',
  accessTokenValidator,
  isAdminValidator,
  getFilterHskIngredientByIdValidator,
  wrapAsync(getFilterHskIngredientByIdController)
)

adminRouter.put(
  '/manage-filters/update-filter-hsk-ingredient/:_id',
  accessTokenValidator,
  isAdminValidator,
  filterMiddleware<updateFilterHskIngredientReqBody>(['option_name', 'category_name', 'category_param']),
  updateFilterHskIngredientValidator,
  wrapAsync(updateFilterHskIngredientController)
)

adminRouter.put(
  '/manage-filters/update-filter-hsk-ingredient-state/:_id',
  accessTokenValidator,
  isAdminValidator,
  filterMiddleware<disableFilterHskIngredientReqBody>(['state']),
  disableFilterHskIngredientValidator,
  wrapAsync(disableFilterHskIngredientController)
)

//HSK Product Type filter
adminRouter.get(
  '/manage-filters/get-all-filter-hsk-product-types',
  accessTokenValidator,
  isAdminValidator,
  wrapAsync(getAllFilterHskProductTypesController)
)

adminRouter.post(
  '/manage-filters/create-new-filter-hsk-product-type',
  accessTokenValidator,
  isAdminValidator,
  createNewFilterHskProductTypeValidator,
  wrapAsync(createNewFilterHskProductTypeController)
)

adminRouter.get(
  '/manage-filters/search-filter-hsk-product-type',
  accessTokenValidator,
  isAdminValidator,
  searchFilterOptionNameValidator,
  wrapAsync(searchFilterHskProductTypesController)
)

adminRouter.get(
  '/manage-filters/get-filter-hsk-product-type-detail/:_id',
  accessTokenValidator,
  isAdminValidator,
  getFilterHskProductTypeByIdValidator,
  wrapAsync(getFilterHskProductTypeByIdController)
)

adminRouter.put(
  '/manage-filters/update-filter-hsk-product-type/:_id',
  accessTokenValidator,
  isAdminValidator,
  filterMiddleware<updateFilterHskProductTypeReqBody>([
    'option_name',
    'description',
    'category_name',
    'category_param'
  ]),
  updateFilterHskProductTypeValidator,
  wrapAsync(updateFilterHskProductTypeController)
)

adminRouter.put(
  '/manage-filters/update-filter-hsk-product-type-state/:_id',
  accessTokenValidator,
  isAdminValidator,
  filterMiddleware<disableFilterHskProductTypeReqBody>(['state']),
  disableFilterHskProductTypeValidator,
  wrapAsync(disableFilterHskProductTypeController)
)

//HSK SIZE FILTER
adminRouter.get(
  '/manage-filters/get-all-filter-hsk-sizes',
  accessTokenValidator,
  isAdminValidator,
  wrapAsync(getAllFilterHskSizesController)
)

adminRouter.post(
  '/manage-filters/create-new-filter-hsk-size',
  accessTokenValidator,
  isAdminValidator,
  createNewFilterHskSizeValidator,
  wrapAsync(createNewFilterHskSizeController)
)

adminRouter.get(
  '/manage-filters/search-filter-hsk-size',
  accessTokenValidator,
  isAdminValidator,
  searchFilterOptionNameValidator,
  wrapAsync(searchFilterHskSizesController)
)

adminRouter.get(
  '/manage-filters/get-filter-hsk-size-detail/:_id',
  accessTokenValidator,
  isAdminValidator,
  getFilterHskSizeByIdValidator,
  wrapAsync(getFilterHskSizeByIdController)
)

adminRouter.put(
  '/manage-filters/update-filter-hsk-size/:_id',
  accessTokenValidator,
  isAdminValidator,
  filterMiddleware<updateFilterHskSizeReqBody>(['option_name', 'category_name', 'category_param']),
  updateFilterHskSizeValidator,
  wrapAsync(updateFilterHskSizeController)
)

adminRouter.put(
  '/manage-filters/update-filter-hsk-size-state/:_id',
  accessTokenValidator,
  isAdminValidator,
  filterMiddleware<disableFilterHskSizeReqBody>(['state']),
  disableFilterHskSizeValidator,
  wrapAsync(disableFilterHskSizeController)
)

//HSK SKIN TYPE FILTER
adminRouter.get(
  '/manage-filters/get-all-filter-hsk-skin-types',
  accessTokenValidator,
  isAdminValidator,
  wrapAsync(getAllFilterHskSkinTypesController)
)

adminRouter.post(
  '/manage-filters/create-new-filter-hsk-skin-type',
  accessTokenValidator,
  isAdminValidator,
  createNewFilterHskSkinTypeValidator,
  wrapAsync(createNewFilterHskSkinTypeController)
)

adminRouter.get(
  '/manage-filters/search-filter-hsk-skin-type',
  accessTokenValidator,
  isAdminValidator,
  searchFilterOptionNameValidator,
  wrapAsync(searchFilterHskSkinTypesController)
)

adminRouter.get(
  '/manage-filters/get-filter-hsk-skin-type-detail/:_id',
  accessTokenValidator,
  isAdminValidator,
  getFilterHskSkinTypeByIdValidator,
  wrapAsync(getFilterHskSkinTypeByIdController)
)

adminRouter.put(
  '/manage-filters/update-filter-hsk-skin-type/:_id',
  accessTokenValidator,
  isAdminValidator,
  filterMiddleware<updateFilterHskSkinTypeReqBody>(['option_name', 'category_name', 'category_param']),
  updateFilterHskSkinTypeValidator,
  wrapAsync(updateFilterHskSkinTypeController)
)

adminRouter.put(
  '/manage-filters/update-filter-hsk-skin-type-state/:_id',
  accessTokenValidator,
  isAdminValidator,
  filterMiddleware<disableFilterHskSkinTypeReqBody>(['state']),
  disableFilterHskSkinTypeValidator,
  wrapAsync(disableFilterHskSkinTypeController)
)

//HSK USES FILTER
adminRouter.get(
  '/manage-filters/get-all-filter-hsk-uses',
  accessTokenValidator,
  isAdminValidator,
  wrapAsync(getAllFilterHskUsesController)
)

adminRouter.post(
  '/manage-filters/create-new-filter-hsk-uses',
  accessTokenValidator,
  isAdminValidator,
  createNewFilterHskUsesValidator,
  wrapAsync(createNewFilterHskUsesController)
)

adminRouter.get(
  '/manage-filters/search-filter-hsk-uses',
  accessTokenValidator,
  isAdminValidator,
  searchFilterOptionNameValidator,
  wrapAsync(searchFilterHskUsesController)
)

adminRouter.get(
  '/manage-filters/get-filter-hsk-uses-detail/:_id',
  accessTokenValidator,
  isAdminValidator,
  getFilterHskUsesByIdValidator,
  wrapAsync(getFilterHskUsesByIdController)
)

adminRouter.put(
  '/manage-filters/update-filter-hsk-uses/:_id',
  accessTokenValidator,
  isAdminValidator,
  filterMiddleware<updateFilterHskUsesReqBody>(['option_name', 'category_name', 'category_param']),
  updateFilterHskUsesValidator,
  wrapAsync(updateFilterHskUsesController)
)

adminRouter.put(
  '/manage-filters/update-filter-hsk-uses-state/:_id',
  accessTokenValidator,
  isAdminValidator,
  filterMiddleware<disableFilterHskUsesReqBody>(['state']),
  disableFilterHskUsesValidator,
  wrapAsync(disableFilterHskUsesController)
)

//HSK ORIGIN FILTER
adminRouter.get(
  '/manage-filters/get-all-filter-hsk-origins',
  accessTokenValidator,
  isAdminValidator,
  wrapAsync(getAllFilterHskOriginsController)
)

adminRouter.post(
  '/manage-filters/create-new-filter-hsk-origin',
  accessTokenValidator,
  isAdminValidator,
  createNewFilterHskOriginValidator,
  wrapAsync(createNewFilterHskOriginController)
)

adminRouter.get(
  '/manage-filters/search-filter-hsk-origin',
  accessTokenValidator,
  isAdminValidator,
  searchFilterOptionNameValidator,
  wrapAsync(searchFilterHskOriginsController)
)

adminRouter.get(
  '/manage-filters/get-filter-hsk-origin-detail/:_id',
  accessTokenValidator,
  isAdminValidator,
  getFilterHskOriginByIdValidator,
  wrapAsync(getFilterHskOriginByIdController)
)

adminRouter.put(
  '/manage-filters/update-filter-hsk-origin/:_id',
  accessTokenValidator,
  isAdminValidator,
  filterMiddleware<updateFilterHskOriginReqBody>(['option_name', 'category_name', 'category_param']),
  updateFilterHskOriginValidator,
  wrapAsync(updateFilterHskOriginController)
)

adminRouter.put(
  '/manage-filters/update-filter-hsk-origin-state/:_id',
  accessTokenValidator,
  isAdminValidator,
  filterMiddleware<disableFilterHskOriginReqBody>(['state']),
  disableFilterHskOriginValidator,
  wrapAsync(disableFilterHskOriginController)
)

//get active filter
adminRouter.get(
  '/manage-filters/get-active-filter-brands',
  accessTokenValidator,
  isAdminValidator,
  wrapAsync(getActiveFilterBrandsController)
)
adminRouter.get(
  '/manage-filters/get-active-filter-dac-tinhs',
  accessTokenValidator,
  isAdminValidator,
  wrapAsync(getActiveFilterDacTinhsController)
)
adminRouter.get(
  '/manage-filters/get-active-filter-hsk-ingredients',
  accessTokenValidator,
  isAdminValidator,
  wrapAsync(getActiveFilterHskIngredientsController)
)
adminRouter.get(
  '/manage-filters/get-active-filter-hsk-product-types',
  accessTokenValidator,
  isAdminValidator,
  wrapAsync(getActiveFilterHskProductTypesController)
)
adminRouter.get(
  '/manage-filters/get-active-filter-hsk-sizes',
  accessTokenValidator,
  isAdminValidator,
  wrapAsync(getActiveFilterHskSizesController)
)
adminRouter.get(
  '/manage-filters/get-active-filter-hsk-skin-types',
  accessTokenValidator,
  isAdminValidator,
  wrapAsync(getActiveFilterHskSkinTypesController)
)
adminRouter.get(
  '/manage-filters/get-active-filter-hsk-uses',
  accessTokenValidator,
  isAdminValidator,
  wrapAsync(getActiveFilterHskUsesController)
)
adminRouter.get(
  '/manage-filters/get-active-filter-hsk-origins',
  accessTokenValidator,
  isAdminValidator,
  wrapAsync(getActiveFilterHskOriginsController)
)
export default adminRouter

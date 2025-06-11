import { Router } from "express"
import { getAllUserController } from "~/controllers/admin.controllers"
import { isAdminValidator } from "~/middlewares/admin.middlewares"
import { accessTokenValidator } from "~/middlewares/users.middlewares"
import { wrapAsync } from "~/utils/handler"

const adminRouter = Router()

adminRouter.get('/manage-users/get-all', accessTokenValidator, isAdminValidator, wrapAsync(getAllUserController))

export default adminRouter
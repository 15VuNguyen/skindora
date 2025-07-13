
import { Router } from 'express'
import { getFilterOptionsController } from '~/controllers/filters.controllers'

const filtersRouter = Router()

filtersRouter.get('/options', getFilterOptionsController)

export default filtersRouter
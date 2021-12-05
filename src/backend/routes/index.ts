'use strict'
import { Router } from 'express'
const router = Router()
router.use("/user", require('./user'))
router.use("/system", require('./system').default)
router.use("/movie", require('./movie').default)
router.use("/libs", require('./libs').default)
router.use("/scraper", require('./scraper').default)
router.use("/filters", require('./filters').default)
export default router
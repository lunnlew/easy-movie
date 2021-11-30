'use strict'

const router = require("express").Router();

router.use("/user", require('./user'))
router.use("/system", require('./system'))
router.use("/movie", require('./movie').default)
router.use("/libs", require('./libs').default)
router.use("/scraper", require('./scraper').default)
router.use("/filters", require('./filters').default)
module.exports = router;
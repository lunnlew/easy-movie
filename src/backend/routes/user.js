

const router = require("express").Router();
const list = async (req, res, next) => {
    res.end("welcome!!")
}
router.get("/list", list)

module.exports = router
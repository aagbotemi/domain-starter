var express = require("express");
var router = express.Router();
const { employController } = require("../controllers/employ");
const { jwtAuth } = require("../middleware/auth");

router.get(
    '/',
    jwtAuth.generalVerifyToken,
    employController.getAll
)

module.exports = router;
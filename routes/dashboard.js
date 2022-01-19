var express = require("express");
var router = express.Router();
const { dashController } = require("../controllers/dashboard");
const { jwtAuth } = require("../middleware/auth");

router.get(
    '/',
    jwtAuth.generalVerifyToken,
    dashController.count
)

module.exports = router;
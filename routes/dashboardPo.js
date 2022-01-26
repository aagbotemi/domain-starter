var express = require("express");
var router = express.Router();
const { dashPoController } = require("../controllers/dashboardPo");
const { jwtAuth } = require("../middleware/auth");

router.get("/", jwtAuth.generalVerifyToken, dashPoController.count);

module.exports = router;

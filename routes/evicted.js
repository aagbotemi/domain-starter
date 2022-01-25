var express = require("express");
var router = express.Router();
const { evictedController } = require("../controllers/evicted");
const { jwtAuth } = require("../middleware/auth");

router.get("/", jwtAuth.generalVerifyToken, evictedController.getAll);

module.exports = router;

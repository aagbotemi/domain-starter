
var express = require("express");
var router = express.Router();
const { jwtAuth } = require("../middleware/auth");
const { authController } = require("../controllers/auth");

router.post(
  "/signin",
  jwtAuth.generalVerifyToken,
  authController.signin
);

module.exports = router;
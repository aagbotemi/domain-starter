var express = require("express");
var router = express.Router();
const { auditTrailController } = require("../controllers/auditTrail");
const { jwtAuth } = require("../middleware/auth");

router.get(
    '/',
    jwtAuth.generalVerifyToken,
    auditTrailController.getAll
)

module.exports = router;
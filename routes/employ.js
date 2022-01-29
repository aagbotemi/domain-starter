var express = require("express");
var router = express.Router();
const { employController } = require("../controllers/employ");
const { jwtAuth } = require("../middleware/auth");

router.post("/", jwtAuth.generalVerifyToken, employController.create);

router.get("/", jwtAuth.generalVerifyToken, employController.getAll);

router.get("/:id", jwtAuth.generalVerifyToken, employController.getById);

router.get("/beneficiary/:id", jwtAuth.generalVerifyToken, employController.getByBeneficiaryId);


// router.put("/:id", jwtAuth.generalVerifyToken, employController.update);


router.delete("/:id", jwtAuth.generalVerifyToken, employController.delete);

module.exports = router;

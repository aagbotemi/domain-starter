var express = require("express");
var router = express.Router();
const { beneficiariesController } = require("../controllers/beneficiaries");
const { jwtAuth } = require("../middleware/auth");


router.get("/:id", jwtAuth.generalVerifyToken, beneficiariesController.getById);


router.get(
  "/all-trainees",
  jwtAuth.adminVerifyToken,
  beneficiariesController.getAllBeneficiaries
);

/* Get all patients. */
router.get(
  "/trainees",
  jwtAuth.poVerifyToken,
  beneficiariesController.getPOTrainees
);

/* Get all patients. */
router.post(
  "/add-trainee",
  jwtAuth.poVerifyToken,
  beneficiariesController.createTrainee
);

module.exports = router;
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

router.get(
  "/trainees",
  jwtAuth.poVerifyToken,
  beneficiariesController.getPOTrainees
);

router.post(
  "/add-trainee",
  jwtAuth.poVerifyToken,
  beneficiariesController.createTrainee
);

router.put(
  "/update/:id",
  jwtAuth.poVerifyToken,
  beneficiariesController.updateTrainee
);

router.delete('/delete/:id', jwtAuth.poVerifyToken, beneficiariesController.delete);


module.exports = router;

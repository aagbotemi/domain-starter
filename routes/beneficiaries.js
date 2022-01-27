var express = require("express");
var router = express.Router();
const { beneficiariesController } = require("../controllers/beneficiaries");
const { jwtAuth } = require("../middleware/auth");

router.get("/:id", jwtAuth.generalVerifyToken, beneficiariesController.getById);

router.get(
  "/",
  jwtAuth.adminVerifyToken,
  beneficiariesController.getAllBeneficiaries
);

router.get(
  "/po/trainees",
  jwtAuth.poVerifyToken,
  beneficiariesController.getPOTrainees
);

router.get(
  "/states",
  jwtAuth.adminVerifyToken,
  beneficiariesController.getTraineesinState
);

router.get(
  "/po/states",
  jwtAuth.poVerifyToken,
  beneficiariesController.getPOTraineesinState
);

router.post("/", jwtAuth.poVerifyToken, beneficiariesController.createTrainee);

router.put(
  "/:id",
  jwtAuth.poVerifyToken,
  beneficiariesController.updateTrainee
);

router.delete("/:id", jwtAuth.poVerifyToken, beneficiariesController.delete);

module.exports = router;

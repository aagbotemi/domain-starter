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
  "/range",
  jwtAuth.adminVerifyToken,
  beneficiariesController.getAllBeneficiariesbyYear
);

router.get(
  "/po/trainees",
  jwtAuth.poVerifyToken,
  beneficiariesController.getPOTrainees
);

router.get(
  "/po/range",
  jwtAuth.poVerifyToken,
  beneficiariesController.getPOTraineesbyYearRange
);

router.get(
  "/:state",
  jwtAuth.adminVerifyToken,
  beneficiariesController.getTraineesinState
);

router.get(
  "/po/:state",
  jwtAuth.poVerifyToken,
  beneficiariesController.getPOTraineesbyGraduationStatus
);

router.get(
  "/:grad",
  jwtAuth.adminVerifyToken,
  beneficiariesController.getTraineesByGraduationStatus
);

router.get(
  "/po/:grad",
  jwtAuth.poVerifyToken,
  beneficiariesController.getPOTraineesbyGraduationStatus
);

router.post("/", jwtAuth.poVerifyToken, beneficiariesController.createTrainee);

router.put(
  "/:id",
  jwtAuth.poVerifyToken,
  beneficiariesController.updateTrainee
);

router.delete("/:id", jwtAuth.poVerifyToken, beneficiariesController.delete);

module.exports = router;

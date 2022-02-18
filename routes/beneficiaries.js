var express = require("express");
var router = express.Router();
const { beneficiariesController } = require("../controllers/beneficiaries");
const { jwtAuth } = require("../middleware/auth");

router.get("/:id", jwtAuth.generalVerifyToken, beneficiariesController.getById);

router.get("/trainee/profile", jwtAuth.generalVerifyToken, beneficiariesController.getbeneficiaryProfile);


router.get(
  "/",
  jwtAuth.adminVerifyToken,
  beneficiariesController.getAllBeneficiaries
);

router.post(
  "/report/range",
  jwtAuth.adminVerifyToken,
  beneficiariesController.getAllBeneficiariesbyYear
);

router.get(
  "/po/trainees",
  jwtAuth.poVerifyToken,
  beneficiariesController.getPOTrainees
);

router.post(
  "/po/range",
  jwtAuth.poVerifyToken,
  beneficiariesController.getPOTraineesbyYearRange
);

router.post(
  "/report/state",
  jwtAuth.adminVerifyToken,
  beneficiariesController.getTraineesinState
);

router.post(
  "/report/grad",
  jwtAuth.adminVerifyToken,
  beneficiariesController.getTraineesbyGradStatus
);

router.post(
  "/report/gender",
  jwtAuth.adminVerifyToken,
  beneficiariesController.getTraineesbyGender
);

router.post(
  "/report/trade-area",
  jwtAuth.adminVerifyToken,
  beneficiariesController.getTraineesinTradeArea
);

// router.get(
//   "/po/:grad",
//   jwtAuth.poVerifyToken,
//   beneficiariesController.getPOTraineesbyGraduationStatus
// );

router.post("/", jwtAuth.poVerifyToken, beneficiariesController.createTrainee);

router.post("/bulk", jwtAuth.poVerifyToken, beneficiariesController.importFromExcel);

router.put(
  "/:id",
  jwtAuth.poVerifyToken,
  beneficiariesController.updateTrainee
);

router.delete("/:id", jwtAuth.poVerifyToken, beneficiariesController.delete);

module.exports = router;

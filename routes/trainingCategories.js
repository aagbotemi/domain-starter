var express = require("express");
var router = express.Router();
const { trainingCategories } = require("../controllers/trainingCategories");
const { jwtAuth } = require("../middleware/auth");

router.get("/:id", jwtAuth.generalVerifyToken, trainingCategories.getById);
router.get(
  "/partnerorg/:id",
  jwtAuth.generalVerifyToken,
  trainingCategories.getPOsInCategory
);

router.get(
  "/categories/:id",
  jwtAuth.generalVerifyToken,
  trainingCategories.getPOCategories
);

// router.get("/", jwtAuth.generalVerifyToken, trainingCategories.getAll);

router.get(
  "/",
  jwtAuth.generalVerifyToken,
  trainingCategories.getAllTrainingCategories
);

router.get(
  "/admin/report",
  jwtAuth.generalVerifyToken,
  trainingCategories.getAllTrainingCategoriesReport
);

// router.get(
//   "/po/categories/1",
//   jwtAuth.poVerifyToken,
//   trainingCategories.getPOTrainingCategories
// );

router.post(
  "/",
  jwtAuth.poVerifyToken,
  trainingCategories.createTrainingCategories
);

router.put("/:id", jwtAuth.poVerifyToken, trainingCategories.update);

router.delete("/:id", jwtAuth.poVerifyToken, trainingCategories.delete);

module.exports = router;

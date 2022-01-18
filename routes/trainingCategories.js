var express = require("express");
var router = express.Router();
const { trainingCategories } = require("../controllers/trainingCategories");
const { jwtAuth } = require("../middleware/auth");

router.get("/:id", jwtAuth.generalVerifyToken, trainingCategories.getById);

router.get("/all/:id", jwtAuth.adminVerifyToken, trainingCategories.getById);

router.get(
  "/all-categories",
  jwtAuth.adminVerifyToken,
  trainingCategories.getAllTrainingCategories
);

router.get(
  "/categories",
  jwtAuth.poVerifyToken,
  trainingCategories.getPOTrainingCategories
);

router.post(
  "/add-category",
  jwtAuth.poVerifyToken,
  trainingCategories.createTrainingCategories
);

router.put("/update/:id", jwtAuth.poVerifyToken, trainingCategories.update);

router.delete("/delete/:id", jwtAuth.poVerifyToken, trainingCategories.delete);

module.exports = router;

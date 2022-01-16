var express = require("express");
var router = express.Router();
const { trainingBatch } = require("../controllers/trainingbatch");
const { jwtAuth } = require("../middleware/auth");

router.get("/:id", jwtAuth.generalVerifyToken, trainingCategories.getById);

router.get("/all/:id", jwtAuth.adminVerifyToken, trainingCategories.getById);

router.get(
  "/all-batch",
  jwtAuth.adminVerifyToken,
  trainingBatch.getAllTrainingBatch
);

router.get(
  "/categories",
  jwtAuth.poVerifyToken,
  trainingBatch.getPOTrainingBatch
);

router.post(
  "/add-batch",
  jwtAuth.poVerifyToken,
  trainingBatch.createTrainingBatch
);

router.put("/update/:id", jwtAuth.poVerifyToken, trainingBatch.update);

router.delete("/delete/:id", jwtAuth.poVerifyToken, trainingBatch.delete);

module.exports = router;

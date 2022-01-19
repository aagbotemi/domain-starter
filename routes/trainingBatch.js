var express = require("express");
var router = express.Router();
const { trainingBatch } = require("../controllers/trainingbatch");
const { jwtAuth } = require("../middleware/auth");

router.get("/:id", jwtAuth.generalVerifyToken, trainingBatch.getById);



router.get(
  "/",
  jwtAuth.adminVerifyToken,
  trainingBatch.getAllTrainingBatch
);

router.get(
  "/batches",
  jwtAuth.poVerifyToken,
  trainingBatch.getPOTrainingBatch
);

router.post(
  "/",
  jwtAuth.poVerifyToken,
  trainingBatch.createTrainingBatch
);

router.put("/:id", jwtAuth.poVerifyToken, trainingBatch.update);

router.delete("/:id", jwtAuth.poVerifyToken, trainingBatch.delete);

module.exports = router;

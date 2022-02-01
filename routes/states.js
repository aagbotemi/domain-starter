var express = require("express");
var router = express.Router();
const { statesController } = require("../controllers/states");
const { jwtAuth } = require("../middleware/auth");

router.post("/", jwtAuth.adminVerifyToken, statesController.create);

router.get("/", jwtAuth.generalVerifyToken, statesController.getAll);

router.get(
  "/states/:id",
  jwtAuth.generalVerifyToken,
  statesController.getPOStates
);

router.get("/:id", jwtAuth.generalVerifyToken, statesController.getById);

router.put("/:id", jwtAuth.adminVerifyToken, statesController.update);

router.delete("/:id", jwtAuth.adminVerifyToken, statesController.delete);

module.exports = router;

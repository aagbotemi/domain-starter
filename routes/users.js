var express = require("express");
var router = express.Router();
const { usersController } = require("../controllers/users");
const { jwtAuth } = require("../middleware/auth");

router.post(
  "/",
  jwtAuth.adminVerifyToken,
  usersController.create
);

router.get(
  "/",
  jwtAuth.adminVerifyToken,
  usersController.getAll
);

router.get(
  "/:id",
  jwtAuth.generalVerifyToken,
  usersController.getById
);

router.get(
  "/:id",
  jwtAuth.generalVerifyToken,
  usersController.getProfile
);

router.put(
  "/:id",
  jwtAuth.adminVerifyToken,
  usersController.update
);

router.delete(
  "/:id",
  jwtAuth.adminVerifyToken,
  usersController.delete
);

module.exports = router;
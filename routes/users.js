var express = require("express");
var router = express.Router();
const { usersController } = require("../controllers/users");
const { jwtAuth } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

router.post(
  "/",
  jwtAuth.adminVerifyToken,
  usersController.create
);

router.post(
  "/admin",
  usersController.create
);

router.get(
  "/",
  jwtAuth.adminVerifyToken,
  usersController.getAll
);

router.get(
  "/profile",
  jwtAuth.generalVerifyToken,
  usersController.getById
);

router.get(
  "/:id",
  jwtAuth.adminVerifyToken,
  usersController.getProfile
);

// router.post(
//   "/reset-password",
//   usersController.forgotPassword
// );

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
const express = require('express');
const router = express.Router();
const { jwtAuth } = require("../middleware");
const { usersController } = require("../controllers/users");

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
  jwtAuth.adminVerifyToken,
  usersController.getById
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
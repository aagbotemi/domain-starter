const express = require('express');
const router = express.Router();
const app = express();
const { jwtAuth } = require("../middleware");
const controller = require("../controllers/users");
const { verifyCreatedUser } = require("../middleware");

module.exports = function(app) {    
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.post(
    "/",
    [
      verifyCreatedUser.checkDuplicateUsernameOrEmail,
      verifyCreatedUser.checkRolesExisted
    ],
    controller.usersController.create
  );

  router.get("/", controller.allAccess);

  router.get(
    "/alluser",
    [jwtAuth.verifyToken],
    controller.userBoard
  );

  router.get(
    "/OP",
    [jwtAuth.verifyToken, jwtAuth.isPO],
    controller.moderatorBoard
  );

  router.get(
    "/admin",
    [jwtAuth.verifyToken, jwtAuth.isAdmin],
    controller.adminBoard
  );

};

module.exports = router;
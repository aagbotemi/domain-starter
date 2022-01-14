const { verifyCreatedUser } = require("../middleware");
const controller = require("../controllers/auth");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/signin",
    [
        verifyCreatedUser.checkDuplicateUsernameOrEmail,
        verifyCreatedUser.checkRolesExisted
    ],
    controller.authController.signin
  );

  app.post("/api/signin", controller.authController.signin);
};
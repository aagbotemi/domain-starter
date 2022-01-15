var express = require("express");
var router = express.Router();
const { rolesController } = require("../controllers/roles");
const { jwtAuth } = require("../middleware/auth");



router.post(
    "/",
    jwtAuth.adminVerifyToken,
    rolesController.create
);

router.get(
    "/",
    jwtAuth.adminVerifyToken,
    rolesController.getAll
);

router.get(
    "/:id",
    jwtAuth.adminVerifyToken,
    rolesController.getById
);

router.put(
    "/:id",
    jwtAuth.adminVerifyToken,
    rolesController.update
);

router.delete(
    "/:id",
    jwtAuth.adminVerifyToken,
    rolesController.delete
);

module.exports = router;
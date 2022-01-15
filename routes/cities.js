var express = require("express");
var router = express.Router();
const { citiesController } = require("../controllers/cities");
const { jwtAuth } = require("../middleware/auth");

router.post(
    "/",
    jwtAuth.adminVerifyToken,
    citiesController.create
);

router.get(
    "/",
    jwtAuth.adminVerifyToken,
    citiesController.getAll
);

router.get(
    "/:id",
    jwtAuth.adminVerifyToken,
    citiesController.getById
);

router.put(
    "/:id",
    jwtAuth.adminVerifyToken,
    citiesController.update
);

router.delete(
    "/:id",
    jwtAuth.adminVerifyToken,
    citiesController.delete
);

module.exports = router;
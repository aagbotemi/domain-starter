var express = require("express");
var router = express.Router();
const { citiesController } = require("../controllers/cities");
const { jwtAuth } = require("../middleware/auth");

router.post(
    "/",
    jwtAuth.generalVerifyToken,
    citiesController.create
);

router.get(
    "/",
    jwtAuth.generalVerifyToken,
    citiesController.getAll
);

router.get(
    "/:id",
    jwtAuth.generalVerifyToken,
    citiesController.getById
);

router.put(
    "/:id",
    jwtAuth.generalVerifyToken,
    citiesController.update
);

router.delete(
    "/:id",
    jwtAuth.adminVerifyToken,
    citiesController.delete
);

module.exports = router;
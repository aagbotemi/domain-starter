var express = require("express");
var router = express.Router();
const { geoPoliticalZonesController } = require("../controllers/geoPoliticalZones");
const { jwtAuth } = require("../middleware/auth");

router.post(
    '/',
    jwtAuth.adminVerifyToken,
    geoPoliticalZonesController.create
)

router.get(
    "/",
    jwtAuth.adminVerifyToken,
    geoPoliticalZonesController.getAll
);

router.get(
    "/:id",
    jwtAuth.adminVerifyToken,
    geoPoliticalZonesController.getById
);

router.put(
    "/:id",
    jwtAuth.adminVerifyToken,
    geoPoliticalZonesController.update
);

router.delete(
    "/:id",
    jwtAuth.adminVerifyToken,
    geoPoliticalZonesController.delete
);

module.exports = router;
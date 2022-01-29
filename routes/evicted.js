var express = require("express");
var router = express.Router();
const { evictedController } = require("../controllers/evicted");
const { jwtAuth } = require("../middleware/auth");



router.post("/", jwtAuth.generalVerifyToken, evictedController.create);

router.get("/", jwtAuth.generalVerifyToken, evictedController.getAll);

router.get(
    "/:id",
    jwtAuth.generalVerifyToken,
    evictedController.getById
);

// router.put(
//     "/:id",
//     jwtAuth.generalVerifyToken,
//     evictedController.update
// );

router.delete(
    "/:id",
    jwtAuth.generalVerifyToken,
    evictedController.delete
);


module.exports = router;

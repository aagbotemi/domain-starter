var express = require("express");
var router = express.Router();
const { partnerOrgController } = require("../controllers/partnerOrganisation");
const { jwtAuth } = require("../middleware/auth");

router.get("/:id", jwtAuth.adminVerifyToken, partnerOrgController.getById);

router.get(
  "/",
  jwtAuth.adminVerifyToken,
  partnerOrgController.getAllPartnerOrg
);

router.post(
  "/",
  jwtAuth.adminVerifyToken,
  partnerOrgController.createPartnerOrg
);

router.put(
  "/:id",
  jwtAuth.adminVerifyToken,
  partnerOrgController.updatePartnerOrg
);

router.put(
  "/categories/:id",
  jwtAuth.adminVerifyToken,
  partnerOrgController.updatePartnerOrgCategories
);


router.put(
  "/states/:id",
  jwtAuth.adminVerifyToken,
  partnerOrgController.updatePartnerOrgCategories
);
router.delete('/:id', jwtAuth.adminVerifyToken, partnerOrgController.delete);


module.exports = router;

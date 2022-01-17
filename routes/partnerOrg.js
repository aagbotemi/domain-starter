var express = require("express");
var router = express.Router();
const { partnerOrgController } = require("../controllers/partnerOrganisation");
const { jwtAuth } = require("../middleware/auth");

router.get("/:id", jwtAuth.adminVerifyToken, partnerOrgController.getById);

router.get(
  "/all-partner",
  jwtAuth.adminVerifyToken,
  partnerOrgController.getAllPartnerOrg
);



router.post(
  "/add-partner",
  jwtAuth.adminVerifyToken,
  partnerOrgController.createPartnerOrg
);

router.put(
  "/update/:id",
  jwtAuth.adminVerifyToken,
  partnerOrgController.updatePartnerOrg
);

router.delete('/delete/:id', jwtAuth.adminVerifyToken, partnerOrgController.delete);


module.exports = router;

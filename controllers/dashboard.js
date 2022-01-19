const db = require("../models");
const { constants } = require("./constants");

exports.dashController = {
  count: async (req, res) => {
    const partnerOrganisationCount = await db.partnerOrganisation.count();
    const trainingCategoriesCount = await db.trainingCategories.count();
    const beneficiariesCount = await db.beneficiaries.count();
    const value = {
      partnerOrganisationCount,
      trainingCategoriesCount,
      beneficiariesCount,
    }
    //   .then((data) => {
        res.status(200).send({
          data: value,
        });
    //   })
    //   .catch((err) => {
    //     constants.handleErr(err, res);
    //   });
  },
};

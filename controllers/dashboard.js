const db = require("../models");
const { constants } = require("./constants");

exports.dashController = {
  count: async (req, res) => {
    try {
      const partnerOrganisationCount = await db.partnerOrganisation.count();
      const trainingCategoriesCount = await db.trainingCategories.count();
      const beneficiariesCount = await db.beneficiaries.count();
      const maleCount = await db.beneficiaries.count({
        where: {
          gender: "male",
        },
      });
      const femaleCount = await db.beneficiaries.count({
        where: {
           gender: "female",
        },
      });
      
      const employCount2 = await db.beneficiaries.count({
        where: {
          employmentStatus: "employed",
        },
      });
      const employCount1 = await db.beneficiaries.count({
        where: {
          employmentStatus: "self employed",
        },
      });
      const unemployCount = await db.beneficiaries.count({
        where: {
          employmentStatus: "unemployed",
        },
      });
      const value = {
        maleCount,
        femaleCount,
        partnerOrganisationCount,
        trainingCategoriesCount,
        beneficiariesCount,
        employCount: parseInt(employCount1 + employCount2),
        unemployCount,
      };

      res.status(200).send({
        data: value,
      });
    } catch (err) {
      constants.handleErr(err, res);
    }
  },
};

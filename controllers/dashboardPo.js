const db = require("../models");
const { constants } = require("./constants");
const { Op } = require("sequelize");

exports.dashPoController = {
  count: async (req, res) => {
    try {
     
      const batchesCount = await db.trainingBatch.count({
        where: {
          partnerorganisationId: req.poId,
        },
      });
      const beneficiariesCount = await db.beneficiaries.count({
        where: {
          partnerorganisationId: req.poId,
        },
      });
      const maleCount = await db.beneficiaries.count({
        where: {
          [Op.and]: [{ partnerorganisationId: req.poId }, { gender: "male" }],
        },
      });
      const femaleCount = await db.beneficiaries.count({
        where: {
          [Op.and]: [{ partnerorganisationId: req.poId }, { gender: "female" }],
        },
      });
      const employCount2 = await db.beneficiaries.count({
        where: {
          [Op.and]: [
            { partnerorganisationId: req.poId },
            { employmentStatus: "employed" },
          ],
        },
      });
      const employCount1 = await db.beneficiaries.count({
        where: {
          [Op.and]: [
            { partnerorganisationId: req.poId },
            { employmentStatus: "self employed" },
          ],
        },
      });
      const unemployCount = await db.beneficiaries.count({
        where: {
          [Op.and]: [
            { partnerorganisationId: req.poId },
            { employmentStatus: "unemployed" },
          ],
        },
      });

      const value = {
        maleCount,
        femaleCount,
        employCount: parseInt(employCount1 + employCount2),
        unemployCount,
        beneficiariesCount,
        batchesCount
      };

      res.status(200).send({
        data: value,
      });
    } catch (err) {
      constants.handleErr(err, res);
    }
  },
};

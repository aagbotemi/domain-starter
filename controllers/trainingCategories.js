const db = require("../models/index");
const bcrypt = require("bcryptjs");
const { QueryTypes, DatabaseError } = require("sequelize");
const { constants } = require("./constants");
const trainingCategories = db.trainingCategories;
const partnerOrganisation = db.partnerOrganisation;
const { auditTrailController } = require("./auditTrail");

require("dotenv").config();

exports.trainingCategories = {
  createTrainingCategories: (req, res) => {
    const category = req.body;
    // category.partnerOrganisationId = req.userId;

    trainingCategories
      .create(category)
      .then((data) => {
        trail = {
          userId: `${req.userId}`,
          action: ` ${req.body.categoryName} category has been created successfully`,
          type: "success",
        };
        auditTrailController.create(trail);
        res.status(200).send({
          success: true,
          message: "Training Category Added Successfully",
          data: data,
        });
      })
      .catch((err) => {
        constants.handleErr(err, res);
      });
  },

  getAll: (req, res) => {
    trainingCategories
      .findAll({
        include: db.beneficiaries,
      })
      .then((data) => {
        const male = [];
        const female = [];
        data.forEach((element) => {
          if (element.benficiary.gender == "male") {
            male.push(element);
          } else {
            female.push(element);
          }
        });
        const report = {
          maleReport: male,
          femaleReport: female,
          maleCount: male.length,
          femaleCount: female.length,
        };
        res.status(200).send({
          success: true,
          message: "All trainees categories retrieved successfully",
          data: data,
          report,
          length: data.length,
        });
        // res.status(200).send(data)
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not fetch record",
        });
      });
  },

  getPOsInCategory: async (req, res) => {
    try {
      const category = await db.sequelize.query(
        `SELECT * FROM partnerorganisationcategory  inner 
      join partnerorganisations on partnerorganisationcategory.partnerorganisationId = partnerorganisations.id 
      WHERE categoryId = :category`,
        {
          replacements: { category: req.params.id },
          type: QueryTypes.SELECT,
        }
      );
      res.status(200).send(category);
    } catch (err) {
      constants.handleErr(err, res);
    }
  },

  getPOCategories: async (req, res) => {
    try {
      const category = await db.sequelize.query(
        `SELECT * FROM partnerorganisationcategory  inner 
    join categories on partnerorganisationcategory.categoryId = categories.id 
    WHERE partnerOrganisationId = :partnerOrg`,
        {
          replacements: { partnerOrg: req.params.id },
          type: QueryTypes.SELECT,
        }
      );
      res.status(200).send({ category, count: category.length });
    } catch (err) {
      constants.handleErr(err, res);
    }
  },

  getById: (req, res) => {
    trainingCategories
      .findOne(
        {
          where: {
            id: req.params.id,
          },
        },
        {
          include: {
            model: db.partnerOrganisation,
            through: {
              attributes: [],
            },
          },
        }
      )
      .then((data) => {
        if (!data) {
          res.status(400).send({
            message: "Record not found",
          });
        }
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
        });
      });
  },

  getAllById: (req, res) => {
    trainingCategories
      .findAll(
        {
          where: {
            id: req.params.id,
          },
        },
        {
          include: [
            {
              model: db.partnerOrganisation,
            },
          ],
        }
      )
      .then((data) => {
        if (!data) {
          res.status(400).send({
            message: "Record not found",
            data: [],
          });
        }
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
          data: [],
        });
      });
  },

  getAllTrainingCategories: (req, res) => {
    trainingCategories
      .findAll({
        include: {
          model: db.partnerOrganisation,
        },
      })
      .then((data) => {
        res.status(200).send({
          success: true,
          message: "All trainees categories retrieved successfully",
          data,
        });
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
          data: [],
        });
      });
  },

  getAllTrainingCategoriesReport: (req, res) => {
    trainingCategories
      .findAll({
        include: {
          model: db.beneficiaries,
        },
      })
      .then((data) => {
        const male = [];
        const female = [];
        data.forEach((element) => {
          if (element.beneficiary.gender === "male") {
            male.push(element);
          } else {
            female.push(element);
          }
        });
        const report = {
          maleReport: male,
          femaleReport: female,
          maleCount: male.length,
          femaleCount: female.length,
        };
        res.status(200).send({
          success: true,
          message: "All trainees categories retrieved successfully",
          data: data,
          report,
          length: data.length,
        });
        // res.status(200).send({
        //   success: true,
        //   message: "All trainees categories retrieved successfully",
        //   data,
        // });
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
          data: [],
        });
      });
  },

  update: (req, res) => {
    const category = req.body;
    // category.id = req.params.id;

    trainingCategories
      .update(category, {
        where: {
          id: req.params.id,
        },
      })
      .then((data) => {
        if (data[0] !== 1) {
          res.status(400).send({
            message: "Record not found",
          });
        }
        trail = {
          userId: `${req.userId}`,
          action: ` ${req.body.categoryName} has been updated`,
          type: "warning",
        };
        auditTrailController.create(trail);
        res.status(200).send({ message: "Record Updated" });
      })
      .catch((err) => {
        constants.handleErr(err, res);
      });
  },
  delete: (req, res) => {
    trainingCategories
      .destroy({
        where: {
          id: req.params.id,
        },
      })
      .then((data) => {
        if (data !== 1) {
          res.status(404).send({
            message: "record not found",
          });
        }
        trail = {
          userId: `${req.userId}`,
          action: `A training category has been deleted`,
          type: "danger",
        };
        auditTrailController.create(trail);
        res.status(200).send({
          message: "record deleted",
        });
      })
      .catch((err) => {
        res.status(400).send({
          message: "could not fetch record",
        });
      });
  },
};

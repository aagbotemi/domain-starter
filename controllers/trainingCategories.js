const db = require("../models/index");
const bcrypt = require("bcryptjs");
const { QueryTypes } = require("sequelize");
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
          actor: `${req.poId}`,
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
      .findAll()
      .then((data) => {
        res.status(200).send(data);
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
      res.status(200).send(category);
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
          model: partnerOrganisation,
        },
      })
      .then((data) => {
        res.status(200).send({
          success: true,
          message: "All training categories retrieved successfully",
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

  // getPOTrainingCategories: (req, res) => {
  //   db.trainingCategories
  //     .findAll(
  //       {
  //         where: {
  //           partnerorganisationId: req.poId,
  //         },
  //       },
  //       {
  //         include: {
  //           model: trainingCategories,
  //         },
  //       }
  //       )
  //       .then((data) => {
  //       res.status(200).send({
  //         success: true,
  //         message: "All training categories retrieved successfully",
  //         data,
  //       });
  //     })
  //     .catch((err) => {
  //       console.log("error++++ ", err);
  //       res.status(400).send({
  //         message: err.message || "Could not find record",
  //         data: [],
  //       });
  //     });
  // },

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
          actor: `${req.poId}`,
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
          actor: `${req.poId}`,
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

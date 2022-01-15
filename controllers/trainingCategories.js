const db = require("../models/index");
const bcrypt = require("bcryptjs");
const { constants } = require("./constants");
const trainingCategories = require("../models/trainingCategories");
const users = db.beneficiaries;
// const department = db.department;
require("dotenv").config();

exports.trainingCategories = {
  createTrainingCategories: (req, res) => {
    const category = req.body;
    // category.partnerOrganisationId = req.userId;

    trainingCategories
      .create(category)
      .then((data) => {
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

  getById: (req, res) => {
    trainingCategories
      .findOne({
        where: {
          id: req.param.id,
        },
      })
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

  getAllTrainingCategories: (req, res) => {
    trainingCategories
      .findAll()
      .then((data) => {
        res.status(200).send({
          success: true,
          message: "All training categories retrieved successfully",
          data: userObj,
        });
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
        });
      });
  },

  getPOTrainees: (req, res) => {
    beneficiaries
      .findAll()
      .then((data) => {
        let traineeObj = [];
        data.forEach((trainee) => {
          if (trainee.partnerOrganisationId === req.userId) {
            traineeObj.push(trainee);
          }
        });
        res.status(200).send({
          success: true,
          message: "All trainees retrieved successfully",
          data: userObj,
        });
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
        });
      });
  },
};

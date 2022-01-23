const db = require("../models/index");
const bcrypt = require("bcryptjs");
const { constants } = require("./constants");
const beneficiaries = db.beneficiaries;
const { auditTrailController } = require("./auditTrail");
// const department = db.department;
require("dotenv").config();

exports.beneficiariesController = {
  createTrainee: (req, res) => {
    const trainee = req.body;
    trainee.partnerOrganisationId = req.poId;

    beneficiaries
      .create(trainee)
      .then((data) => {
        trail = {
          actor: `${req.poId}`,
          action: `${req.body.firstName} ${req.body.lastName} added as a beneficiary`,
          type: "success",
        }
        auditTrailController.create(trail)
        res.status(200).send({
          success: true,
          message: "Trainee Added Successfully",
          data: data,
        });
      })
      .catch((err) => {
        constants.handleErr(err, res);
      });
  },

  getById: (req, res) => {
    beneficiaries
      .findOne(
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
            {
              model: db.trainingCategories,
            },
            {
              model: db.trainingBatch,
            },
          ],
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

  getAllBeneficiaries: (req, res) => {
    beneficiaries
      .findAll({
        include: [
          {
            model: db.partnerOrganisation,
          },
          {
            model: db.trainingCategories,
          },
          {
            model: db.trainingBatch,
          },
        ],
      })
      .then((data) => {
        res.status(200).send({
          success: true,
          message: "All beneficiaries retrieved successfully",
          data,
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
      .findAll({
        include: [
          {
            model: db.partnerOrganisation,
          },
          {
            model: db.trainingCategories,
          },
          {
            model: db.trainingBatch,
          },
        ],
      })
      .then((data) => {
        let traineeObj = [];
        data.forEach((trainee) => {
          if (trainee.partnerOrganisationId === req.poId) {
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
  updateTrainee: (req, res) => {
    const trainee = req.body;

    beneficiaries
      .update(trainee, {
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
          action: `${req.body.firstName} ${req.body.lastName} details has been updated`,
          type: "warning",
        }
        auditTrailController.create(trail)
        res.status(200).send({ message: "Record Updated" });
      })
      .catch((err) => {
        constants.handleErr(err, res);
      });
  },
  delete: (req, res) => {
    beneficiaries
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
          action: `A trainee details has been deleted`,
          type: "danger",
        }
        auditTrailController.create(trail)

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

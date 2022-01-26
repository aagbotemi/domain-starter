const db = require("../models/index");
const bcrypt = require("bcryptjs");
const { constants } = require("./constants");
const beneficiaries = db.beneficiaries;
const { auditTrailController } = require("./auditTrail");
const { evictedController } = require("./evicted");
const { employController } = require("./employ");

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
          userId: `${req.userId}`,
          action: `${req.body.firstName} ${req.body.lastName} added as a beneficiary`,
          type: "success",
        };
        auditTrailController.create(trail);

        if (
          data.graduationStatus == "evicted" ||
          data.graduationStatus == "dropped out"
        ) {
          evictedInfo = {
            beneficiaryId: `${data.id}`,
            reason: `${req.body.reason}`,
            dateEvicted: `${req.body.dateEvicted}`,
          };
          evictedController.create(evictedInfo);
        }
        if (
          data.employmentStatus == "employed" ||
          data.employmentStatus == "self employed"
        ) {
          employInfo = {
            beneficiaryId: `${data.id}`,
            organisationName: `${req.body.organisationName}`,
            organisationAddress: `${req.body.organisationAddress}`,
            yearEmployed: `${req.body.yearEmployed}`,
          };
          employController.create(employInfo);
        }
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
      .findOne({
        where: {
          id: req.params.id,
        },
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
          {
            model: db.employ,
          },
          {
            model: db.evicted,
          },
        ],
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
          {
            model: db.employ,
          },
          {
            model: db.evicted,
          },
        ],
      })
      .then((data) => {
        res.status(200).send({
          success: true,
          message: "All beneficiaries retrieved successfully",
          length: data.length,
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
        where: {
          partnerorganisationId: req.poId,
        },
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
          {
            model: db.employ,
          },
          {
            model: db.evicted,
          },
        ],
      })
      .then((data) => {
        res.status(200).send({
          success: true,
          message: "All trainees retrieved successfully",
          data: data,
          length: data.length,
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
          userId: `${req.userId}`,
          action: `${req.body.firstName} ${req.body.lastName} details has been updated`,
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
          userId: `${req.userId}`,
          action: `A trainee details has been deleted`,
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

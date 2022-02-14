const db = require("../models/index");
const bcrypt = require("bcryptjs");
const { constants } = require("./constants");
const trainingBatch = db.trainingBatch;
const partnerorganisation = db.partnerOrganisation;
const { auditTrailController } = require("./auditTrail");

require("dotenv").config();

exports.trainingBatch = {
  createTrainingBatch: (req, res) => {
    const batch = req.body;
    batch.partnerorganisationId = req.poId;
    // category.partnerOrganisationId = req.userId;
    // partnerorganisationId: req.poId,

    trainingBatch
      .create(batch)
      .then((data) => {
        trail = {
          userId: `${req.userId}`,
          action: ` ${req.body.batchName} has been created successfully`,
          type: "success",
        };
        auditTrailController.create(trail);
        res.status(200).send({
          success: true,
          message: "Training batch Added Successfully",
          data: data,
        });
      })
      .catch((err) => {
        constants.handleErr(err, res);
      });
  },

  getById: (req, res) => {
    trainingBatch
      .findOne(
        {
          where: {
            id: req.params.id,
          },
        },
        {
          include: {
            model: partnerorganisation,
          },
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
        });
      });
  },

  getAllById: (req, res) => {
    trainingBatch
      .findAll(
        {
          where: {
            id: req.params.id,
          },
        },
        {
          include: {
            model: partnerorganisation,
          },
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
        });
      });
  },

  getAllTrainingBatch: (req, res) => {
    trainingBatch
      .findAll({
        include: {
          model: partnerorganisation,
        },
      })
      .then((data) => {
        res.status(200).send({
          success: true,
          message: "All training batch retrieved successfully",
          data,
        });
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
        });
      });
  },

  getPOTrainingBatch: (req, res) => {
    trainingBatch
      .findAll(
        {
          where: {
            partnerorganisationId: req.poId,
          },
        }
      )
      .then((data) => {
        res.status(200).send({
          success: true,
          message: "All training batch retrieved successfully",
          data,
        });
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
        });
      });
  },

  update: (req, res) => {
    const batch = req.body;
    // category.id = req.params.id;

    trainingBatch
      .update(batch, {
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
          action: `A training batch has been updated`,
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
    trainingBatch
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
          action: `A training batch has been deleted`,
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
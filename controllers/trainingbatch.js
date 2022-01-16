const db = require("../models/index");
const bcrypt = require("bcryptjs");
const { constants } = require("./constants");
const trainingBatch = require("../models/trainingBatch");

require("dotenv").config();

exports.trainingBatch = {
  createTrainingBatch: (req, res) => {
    const batch = req.body;
    // category.partnerOrganisationId = req.userId;

    trainingBatch
      .create(batch)
      .then((data) => {
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
            id: req.param.id,
          },
        },
        {
          include: {
            model: partnerOrganisation,
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
    trainingBatch
      .findAll(
        {
          where: {
            id: req.param.id,
          },
        },
        {
          include: {
            model: partnerOrganisation,
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

  getAllTrainingBatch: (req, res) => {
    trainingBatch
      .findAll({
        include: {
          model: partnerOrganisation,
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
            partnerOrganisationId: req.userId,
          },
        },
        
      )
      .then((data) => {
        res.status(200).send({
          success: true,
          message: "All batches retrieved successfully",
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
    // category.id = req.param.id;

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

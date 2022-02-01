const db = require("../models");
const { constants } = require("./constants");
const { QueryTypes, DatabaseError } = require("sequelize");

const states = db.states;
const geoPoliticalZone = db.geoPoliticalZones;
const { auditTrailController } = require("./auditTrail");

exports.statesController = {
  create: (req, res) => {
    const state = req.body;
    states
      .bulkCreate(state)
      .then((data) => {
        trail = {
          userId: `${req.userId}`,
          action: ` ${req.body.stateName} has been created successfully`,
          type: "success",
        };
        auditTrailController.create(trail);
        res.status(200).send({
          success: true,
          message: "States Added Successfully",
          data: data,
        });
      })
      .catch((err) => {
        constants.handleErr(err, res);
      });
  },
  getAll: (req, res) => {
    states
      .findAll({
        include: {
          model: geoPoliticalZone,
        },
      })
      .then((data) => {
        if (data.length == 0) {
          res.status(404).send({
            status: false,
            message: "No state has been created!!!",
          });
        }
        res.status(200).send({
          status: true,
          length: data.length,
          data,
        });
      })
      .catch((err) => {
        res.status(400).send({
          status: false,
          message: err.message || "Could not fetch record",
        });
      });
  },
  getPOStates: async (req, res) => {
    try {
      const state = await db.sequelize.query(
        `SELECT * FROM partnerorganisationstate  inner 
        join states on partnerorganisationstate.stateId = states.id 
        WHERE partnerOrganisationId = :partnerOrg`,
        {
          replacements: { partnerOrg: req.params.id },
          type: QueryTypes.SELECT,
        }
      );
      res.status(200).send({ state, count: state.length });
    } catch (err) {
      constants.handleErr(err, res);
    }
  },
  getById: (req, res) => {
    states
      .findOne(
        {
          where: {
            id: req.params.id,
          },
        },
        {
          include: {
            model: geoPoliticalZone,
          },
        }
      )
      .then((data) => {
        if (data == undefined) {
          res.status(404).send({
            status: false,
            message: "record not found",
          });
        }
        res.status(200).send({
          status: true,
          data,
        });
      })
      .catch((err) => {
        res.status(400).send({
          status: false,
          message: err.message || "Could not fetch record",
        });
      });
  },
  update: (req, res) => {
    const state = req.body;
    states
      .update(state, {
        where: {
          id: req.params.id,
        },
      })
      .then((data) => {
        if (data[0] !== 1) {
          res.status(404).send({
            status: false,
            message: "record not found",
          });
        }
        trail = {
          userId: `${req.userId}`,
          action: ` ${req.body.stateName} has been updated`,
          type: "success",
        };
        auditTrailController.create(trail);
        res.status(200).send(data);
      })
      .catch((err) => {
        constants.handleErr(err, res);
      });
  },
  delete: (req, res) => {
    states
      .destroy({
        where: {
          id: req.params.id,
        },
      })
      .then((data) => {
        if (data !== 1) {
          res.status(404).send({
            status: false,
            message: "record not found",
          });
        }
        trail = {
          userId: `${req.userId}`,
          action: `A state has been deleted`,
          type: "danger",
        };
        auditTrailController.create(trail);
        res.status(200).send({
          status: true,
          message: "record deleted",
        });
      })
      .catch((err) => {
        constants.handleErr(err, res);
      });
  },
};

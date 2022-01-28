const db = require("../models");
const evicted = db.evicted;
const user = db.users;
const beneficiaries = db.beneficiaries;
const { constants } = require("./constants");

exports.evictedController = {
  create: (req, res) => {
    const evictedInfo = req.body;
    evicted
      .create(evictedInfo)
      .then((data) => {
        trail = {
          userId: `${req.userId}`,
          action: ` ${req.body.beneficiaryId} eviction info has been created successfully`,
          type: "success",
        };
        auditTrailController.create(trail);
        res.status(200).send({
          success: true,
          message: "eviction info Added Successfully",
          data: data,
        });
      })
      .catch((err) => {
        constants.handleErr(err, res);
      });
  },
  getById: (req, res) => {
    evicted
      .findOne({
        where: {
          id: req.params.id,
        },
        include: {
          model: db.beneficiaries,
        },
      })
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
        });
      });
  },
  getAll: (req, res) => {
    evicted
      .findAll({
        include: [
          {
            model: beneficiaries,
          },
        ],
      })
      .then((data) => {
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


  update: (req, res) => {
    const info = req.body;
    // category.id = req.params.id;

    evicted
      .update(info, {
        where: {
          beneficiaryId: req.params.id,
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
          action: ` ${req.body.beneficiaryId} has been updated`,
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
    evicted
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
          action: ` ${req.body.beneficiaryId} evicted info has been deleted`,
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

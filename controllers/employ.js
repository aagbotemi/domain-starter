const db = require("../models");
const employ = db.employ;
const user = db.users;
const beneficiaries = db.beneficiaries;

exports.employController = {
  create: (req, res) => {
    const employInfo = req.body;
    employ
      .create(employInfo)
      .then((data) => {
        benficiaryInfo = {
          employmentStatus: req.body.employmentStatus,
        };

        beneficiaries.update(benficiaryInfo, {
          where: {
            beneficiaryId: req.body.beneficiaryId,
          },
        });

        trail = {
          userId: `${req.userId}`,
          action: ` ${req.body.beneficiaryId} employ info has been created successfully`,
          type: "success",
        };
        auditTrailController.create(trail);
        res.status(200).send({
          success: true,
          message: "employ info Added Successfully",
          data: data,
        });
      })
      .catch((err) => {
        constants.handleErr(err, res);
      });
  },

  getById: (req, res) => {
    employ
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

  getByBeneficiaryId: (req, res) => {
    employ
      .findOne({
        where: {
          beneficiaryId: req.params.id,
        }
       
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
    employ
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

    employ
      .update(info, {
        where: {
          beneficiaryId: req.body.beneficiaryId,
        },
      })
      .then((data) => {
        res.status(200).send({ message: "Record Updated" });

        trail = {
          userId: `${req.userId}`,
          action: ` ${req.body.beneficiaryId} has been updated`,
          type: "warning",
        };
        auditTrailController.create(trail);
      })
      .catch((err) => {
        constants.handleErr(err, res);
      });
  },

  delete: (req, res) => {
    employ
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
          action: ` ${req.body.beneficiaryId} employment info has been deleted`,
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

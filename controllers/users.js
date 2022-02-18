const bcrypt = require("bcryptjs");
const db = require("../models");
const { constants } = require("./constants");
const users = db.users;
const partnerOrganisation = db.partnerOrganisation;
const { auditTrailController } = require("./auditTrail");
// const mailgun = require("mailgun-js");
const DOMAIN = "sandbox90292-2309ds-jicdo929-jsd9jkc@mailgun.org";
// const mg = mailgun({ apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN });

const Op = db.Sequelize.Op;

exports.usersController = {
  create: (req, res) => {
    const user = req.body;
    // const user = {
    //   fullName: req.body.fullName,
    //   email: req.body.email,
    //   phoneNumber: req.body.phoneNumber,
    //   password: req.body.password,
    //   userName: req.body.userName,
    //   userType: req.body.userType,
    //   profileImage: req.file ? req.file.path : null,
    //   partnerorganisationId: req.body.partnerorganisationId,
    // };
    user.password = bcrypt.hashSync(user.password, 10);
    users
      .create(user)
      .then((data) => {
        trail = {
          userId: `${req.userId}`,
          action: `${req.body.fullName} has been created successfully`,
          type: "success",
        };
        auditTrailController.create(trail);
        res.status(200).send({
          success: true,
          message: "User Added Successfully",
          data: data,
        });
      })
      .catch((error) => {
        res.status(500).send({
          message: error.message,
        });
      });
  },
  getAll: (req, res) => {
    users
      .findAll({
        include: [
          {
            model: db.partnerOrganisation,
          },
        ],
      })
      .then((data) => {
        if (data.length == 0) {
          res.status(404).send({
            status: false,
            message: "No user has been created!!!",
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

  getById: (req, res) => {
    users
      .findOne(
        {
          where: {
            id: req.userId,
          },
        },
        {
          include: {
            model: db.partnerOrganisation,
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

  getProfile: (req, res) => {
    const id = req.userId;
    users
      .findOne(
        {
          where: {
            id: req.params.id,
          },
        },
        {
          include: {
            model: db.partnerOrganisation,
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
    const user = req.body;
    users
      .update(user, {
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
          action: `A user details has been updated`,
          type: "warning",
        };
        auditTrailController.create(trail);
        res.status(200).send(data);
      })
      .catch((err) => {
        constants.handleErr(err, res);
      });
  },

  forgotPassword: async (req, res) => {
    const reset = req.body;
    reset.password = bcrypt.hashSync(reset.password, 10);
    users
      .update(reset, {
        where: {
          email: req.body.email,
        },
      })
      .then((data) => {
        if (data[0] !== 1) {
          res.status(404).send({
            status: false,
            message: "record not found",
          });
        }
        res.status(200).send(data);
      })
      .catch((err) => {
        constants.handleErr(err, res);
      });
  },
  delete: (req, res) => {
    users
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
          action: `A users has been deleted`,
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

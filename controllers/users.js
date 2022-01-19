const bcrypt = require("bcryptjs");
const db = require("../models");
const { constants } = require("./constants");
const users = db.users;
const Role = db.roles;

const Op = db.Sequelize.Op;

exports.usersController = {
  create: (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 10);
    //     const userObj = await users.create(user);
    //     userObj
    //   .setPartnerOrganisations(user.po)
    users
      .create(user)
      .then((data) => {
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
      .findAll()
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
      .findOne({
        where: {
          id: req.userId,
        },
      })
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
    users
      .findOne({
        where: {
          id: req.params.id,
        },
      })
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
        res.status(200).send(data);
      })
      .catch((err) => {
        constants.handleErr(err, res);
      });
  },

  forgotPassword: (req, res) => {
    const password = req.body.password;
    users
      .findOne({
        where: {
          email: req.body.email,
        },
      }).update(password)
      .then((data) => {
        if (req.body.email == null) {
          res.status(404).send({
            status: false,
            message: "record not found",
          });
        }
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

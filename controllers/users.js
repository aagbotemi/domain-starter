const bcrypt = require("bcryptjs");
const db = require("../models");
const { constants } = require("./constants");
const users = db.users;
const requestPassword = db.requestPassword;
const partnerOrganisation = db.partnerOrganisation;
const { auditTrailController } = require("./auditTrail");
const randToken = require('rand-token');
const sendEmail = require('../middleware/mailService');
const Op = db.Sequelize.Op;
const { sign } = require("jsonwebtoken");
const config = require("../config/auth");

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
            id: id,
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

  resetPassword: async (req, res) => {
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
  sendMail: async (req, res) => {
    const email = req.body.email;
    const subject = "Reset Password Link - MEIA";
    const body = "Just a test"
    try {
      const sentMail = sendEmail(email, subject, body)
      console.log(sentMail);
    } catch (e) {
      console.log(e)
    }
  },

  forgotPassword: async (req, res) => {
    const email = req.body.email;
    users
      .findOne(
        {
          where: {
            email: email,
          },
        }
      )
      .then((data) => {
        if (!data) {
          res.status(404).send({
            status: false,
            message: "The Email is not registered with us",
          });
        }

        let payload = {
          id: data.id,
          email: data.email,
          userType: data.userType,
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          userName: data.userName,
          profileImage: data.profileImage,
          partnerOrganisation: data.partnerorganisationId,
          beneficiaryInfo: data.beneficiary,
        };
        let token = sign(payload, config.secretKey, {
          expiresIn: 36000,
        });
        const subject = 'Reset Password Link - MEIA';
        const text = `You requested for reset password, kindly use this <a href="https://itf-necatsdp.com/updatepassword?token=${token}">Link</a> to reset your password`;
        
        try {
          // send the mail
          const sentEmail = sendEmail(email, subject, text);
          console.log(sentEmail);
          // save the token
          requestPassword.create({resetToken: token, userId: payload.id})
            .then((resp) => {
              res.status(200).send({
                success: true,
                message: "The reset password link has been sent to your email address"
              });
            }).catch(err => {
              constants.handleErr(err, res)
            })
        } catch (e) {
          console.log(e)
        }
      })
      .catch((err) => {
        constants.handleErr(err, res);
      });
  },

  resetForgotPassword: (req, res) => {
    const reset = req.body;
    reset.password = bcrypt.hashSync(reset.password, 10);
    requestPassword
      .findOne({
        where: {
          token: reset.token,
        },
      })
      .then((data) => {
        users.update(reset.password, {
          where: {
            id: data.userId
          },
        }).then((res) => {
          if (res !== 1) {
            res.status(404).send({
              status: false,
              message: "record not found",
            });
          }
          trail = {
            action: `A users detail has been updated`,
            type: "warning",
          };
          auditTrailController.create(trail);
          res.status(200).send({
            success: true,
            message: " Your password has been updated successfully",
            res
          });

        })
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

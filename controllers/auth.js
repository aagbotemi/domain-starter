const db = require("../models");
const { constants } = require("./constants");
const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");

const Users = db.users;
const Roles = db.roles;
const config = require("../config/auth");
const { auditTrailController } = require("./auditTrail");

exports.authController = {
  signin: (req, res) => {
    Users.findOne({
      where: {
        email: req.body.email,
      },
      include: {
        model: db.beneficiaries,
      },
    })
      .then((user) => {
        // if record doesn't exist
        if (!user) {
          return res.status(404).send({
            message: "Invalid username or password",
          });
        }

        // compare the request password with the hashed password saved in the database
        let passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );

        // if password is not valid
        if (!passwordIsValid) {
          return res.status(404).send({
            accessToken: null,
            message: "Invalid username or password",
          });
        }

        let payload = {
          id: user.id,
          email: user.email,
          userType: user.userType,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          userName: user.userName,
          profileImage: user.profileImage,
          partnerOrganisation: user.partnerorganisationId,
          beneficiaryInfo: user.beneficiary,
        };
        let token = sign(payload, config.secretKey, {
          expiresIn: 36000,
        });

        res.status(200).send({
          status: true,
          userData: payload,
          accessToken: token,
        });
      })
      .catch((err) => {
        res.status(400).send({
          status: false,
          message: err.message || "Could not fetch record",
        });
      });
  },
};

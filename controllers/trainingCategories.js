const db = require("../models/index");
const bcrypt = require("bcryptjs");
const { constants } = require("./constants");
const trainingCategories = db.trainingCategories;
const partnerOrganisation = db.partnerOrganisation;

require("dotenv").config();

exports.trainingCategories = {
  createTrainingCategories: (req, res) => {
    const category = req.body;
    // category.partnerOrganisationId = req.userId;

    trainingCategories
      .create(category)
      .then((data) => {
        res.status(200).send({
          success: true,
          message: "Training Category Added Successfully",
          data: data,
        });
      })
      .catch((err) => {
        constants.handleErr(err, res);
      });
  },
  // getAll:(req,res)=>{
  //   trainingCategories.findAll().then(data=>{
  //   res.status(200).send(data)
  //   }).catch(err=>{
  //       res.status(400).send({
  //           message:err.message || "Could not fetch record"
  //       })

  //   })

  // },

  getById: (req, res) => {
    trainingCategories
      .findOne(
        {
          where: {
            id: req.params.id,
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
    trainingCategories
      .findAll(
        {
          where: {
            id: req.params.id,
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
            data: [],
          });
        }
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
          data: [],
        });
      });
  },

  getAllTrainingCategories: (req, res) => {
    trainingCategories
      .findAll()
      .then((data) => {
        res.status(200).send({
          success: true,
          message: "All training categories retrieved successfully",
          data,
        });
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
          data: [],
        });
      });
  },

  getPOTrainingCategories: (req, res) => {
    trainingCategories
      .findAll({
        where: {
          partnerorganisationId: req.poId,
        },
      })
      .then((data) => {
        res.status(200).send({
          success: true,
          message: "All training categories retrieved successfully",
          data,
        });
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
          data: [],
        });
      });
  },

  update: (req, res) => {
    const category = req.body;
    // category.id = req.param.id;

    trainingCategories
      .update(category, {
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
    trainingCategories
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

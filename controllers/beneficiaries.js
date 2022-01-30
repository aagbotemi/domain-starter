const db = require("../models/index");
const bcrypt = require("bcryptjs");
const { constants } = require("./constants");
const beneficiaries = db.beneficiaries;
const { auditTrailController } = require("./auditTrail");
const { evictedController } = require("./evicted");
const { employController } = require("./employ");
const { Op } = require("sequelize");

// const department = db.department;
require("dotenv").config();

exports.beneficiariesController = {
  createTrainee: (req, res) => {
    const trainee = req.body;

    beneficiaries
      .create(trainee)
      .then((data) => {
        trail = {
          userId: `${req.userId}`,
          action: `${req.body.firstName} ${req.body.lastName} added as a beneficiary`,
          type: "success",
        };
        auditTrailController.create(trail);

        if (
          data.graduationStatus == "evicted" ||
          data.graduationStatus == "dropped out"
        ) {
          evictedInfo = {
            beneficiaryId: `${data.id}`,
            reason: `${req.body.reason}`,
            dateEvicted: `${req.body.dateEvicted}`,
          };
          evictedController.create(evictedInfo);
        }
        if (
          data.employmentStatus == "employed" ||
          data.employmentStatus == "self employed"
        ) {
          employInfo = {
            beneficiaryId: `${data.id}`,
            organisationName: `${req.body.organisationName}`,
            organisationAddress: `${req.body.organisationAddress}`,
            yearEmployed: `${req.body.yearEmployed}`,
          };
          employController.create(employInfo);
        }
        res.status(200).send({
          success: true,
          message: "Trainee Added Successfully",
          data: data,
        });
      })
      .catch((err) => {
        constants.handleErr(err, res);
      });
  },

  getById: (req, res) => {
    beneficiaries
      .findOne({
        where: {
          id: req.params.id,
        },
        include: [
          {
            model: db.partnerOrganisation,
          },
          {
            model: db.trainingCategories,
          },
          {
            model: db.trainingBatch,
          },
          {
            model: db.employ,
          },
          {
            model: db.evicted,
          },
        ],
      })
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

  getAllBeneficiaries: (req, res) => {
    beneficiaries
      .findAll({
        include: [
          {
            model: db.partnerOrganisation,
          },
          {
            model: db.trainingCategories,
          },
          {
            model: db.trainingBatch,
          },
          {
            model: db.employ,
          },
          {
            model: db.evicted,
          },
        ],
      })
      .then((data) => {
        const male = [];
        const female = [];
        data.forEach((element) => {
          if (element.gender == "male") {
            male.push(element);
          } else {
            female.push(element);
          }
        });
        const report = {
          maleReport: male,
          femaleReport: female,
          maleCount: male.length,
          femaleCount: female.length,
        };
        res.status(200).send({
          success: true,
          message: "All trainees retrieved successfully",
          report,
          length: data.length,
          data,
        });
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
        });
      });
  },

  getAllBeneficiariesbyYear: (req, res) => {
    const startedDate = new Date(req.body.startDate - 1);
    const endDate = new Date(req.body.endDate + 1);
    beneficiaries
      .findAll(
        {
          where: {
            [Op.and]: {
              [Op.gte]: startedDate,
              [Op.lte]: endDate,
            },
          },
        },
        {
          include: [
            {
              model: db.partnerOrganisation,
            },
            {
              model: db.trainingCategories,
            },
            {
              model: db.trainingBatch,
            },
            {
              model: db.employ,
            },
            {
              model: db.evicted,
            },
          ],
        }
      )
      .then((data) => {
        const male = [];
        const female = [];
        data.forEach((element) => {
          if (element.gender == "male") {
            male.push(element);
          } else {
            female.push(element);
          }
        });
        const report = {
          maleReport: male,
          femaleReport: female,
          maleCount: male.length,
          femaleCount: female.length,
        };
        res.status(200).send({
          success: true,
          message: "All trainees retrieved successfully",
          report,
          length: data.length,
          data,
        });
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
        });
      });
  },

  getPOTrainees: (req, res) => {
    beneficiaries
      .findAll({
        where: {
          partnerorganisationId: req.poId,
        },
        include: [
          {
            model: db.partnerOrganisation,
          },
          {
            model: db.trainingCategories,
          },
          {
            model: db.trainingBatch,
          },
          {
            model: db.employ,
          },
          {
            model: db.evicted,
          },
        ],
      })
      .then((data) => {
        const male = [];
        const female = [];
        data.forEach((element) => {
          if (element.gender == "male") {
            male.push(element);
          } else {
            female.push(element);
          }
        });
        const report = {
          maleReport: male,
          femaleReport: female,
          maleCount: male.length,
          femaleCount: female.length,
        };

        res.status(200).send({
          success: true,
          message: "All trainees retrieved successfully",
          report,
          data,
          length: data.length,
        });
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
        });
      });
  },

  getPOTraineesbyYearRange: (req, res) => {
    const startedDate = new Date(req.body.startDate - 1);
    const endDate = new Date(req.body.endDate + 1);
    beneficiaries
      .findAll({
        where: {
          [Op.and]: [
            { partnerorganisationId: req.poId },
            { trainingYear: { [Op.between]: [startedDate, endDate] } },
          ],
        },
        include: [
          {
            model: db.partnerOrganisation,
          },
          {
            model: db.trainingCategories,
          },
          {
            model: db.trainingBatch,
          },
          {
            model: db.employ,
          },
          {
            model: db.evicted,
          },
        ],
      })
      .then((data) => {
        // const male = [];
        // const female = [];
        // data.forEach((element) => {
        //   if (element.gender == "male") {
        //     male.push(element);
        //   } else {
        //     female.push(element);
        //   }
        // });
        // const report = {
        //   maleReport: male,
        //   femaleReport: female,
        //   maleCount: male.length,
        //   femaleCount: female.length,
        // };

        res.status(200).send({
          success: true,
          message: "All trainees retrieved successfully",
          data,
          length: data.length,
        });
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
        });
      });
  },

  updateTrainee: (req, res) => {
    const trainee = req.body;

    beneficiaries
      .update(trainee, {
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
          action: `${req.body.firstName} ${req.body.lastName} details has been updated`,
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
    beneficiaries
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
          action: `A trainee details has been deleted`,
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

  getTraineesinState: (req, res) => {
    const po = req.body.partnerorganisationId;
    const state = req.body.stateOfResidence;
    if (po == "all") {
      var condition = { stateOfResidence: state };
    } else if (state == "all") {
      var condition = { partnerorganisationId: po };
    } else {
      var condition = {
        [Op.and]: [{ partnerorganisationId: po }, { stateOfResidence: state }],
      };
    }
    beneficiaries
      .findAll({
        where: {
          condition,
        },
        include: [
          {
            model: db.partnerOrganisation,
          },
          {
            model: db.trainingCategories,
          },
          {
            model: db.trainingBatch,
          },
          {
            model: db.employ,
          },
          {
            model: db.evicted,
          },
        ],
      })
      .then((data) => {
        const male = [];
        const female = [];
        data.forEach((element) => {
          if (element.gender == "male") {
            male.push(element);
          } else {
            female.push(element);
          }
        });
        res.status(200).send({
          success: true,
          message: "All trainees retrieved successfully",
          data: data,
          maleReport: male,
          femaleReport: female,
          maleCount: male.length,
          femaleCount: female.length,
          length: data.length,
        });
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
        });
      });
  },

  getTraineesbyGender: (req, res) => {
    const po = req.body.partnerorganisationId;
    const gender = req.body.gender;
    if (po == "all") {
      var condition = { gender: gender };
    } else if (gender == "all") {
      var condition = { partnerorganisationId: po };
    } else {
      var condition = {
        [Op.and]: [{ partnerorganisationId: po }, { gender: gender }],
      };
    }
    beneficiaries
      .findAll({
        where: {
          condition,
        },
        include: [
          {
            model: db.partnerOrganisation,
          },
          {
            model: db.trainingCategories,
          },
          {
            model: db.trainingBatch,
          },
          {
            model: db.employ,
          },
          {
            model: db.evicted,
          },
        ],
      })
      .then((data) => {
        const male = [];
        const female = [];
        data.forEach((element) => {
          if (element.gender == "male") {
            male.push(element);
          } else {
            female.push(element);
          }
        });
        res.status(200).send({
          success: true,
          message: "All trainees retrieved successfully",
          data: data,
          maleReport: male,
          femaleReport: female,
          maleCount: male.length,
          femaleCount: female.length,
          length: data.length,
        });
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
        });
      });
  },

  getTraineesinTradeArea: (req, res) => {
    const po = req.body.partnerorganisationId;
    const categoryId = req.body.categoryId;
    if (po == "all") {
      var condition = { categoryId: categoryId };
    } else if (categoryId == "all") {
      var condition = { partnerorganisationId: po };
    } else {
      var condition = {
        [Op.and]: [{ partnerorganisationId: po }, { categoryId: categoryId }],
      };
    }
    beneficiaries
      .findAll({
        where: {
          condition,
        },
        include: [
          {
            model: db.partnerOrganisation,
          },
          {
            model: db.trainingCategories,
          },
          {
            model: db.trainingBatch,
          },
          {
            model: db.employ,
          },
          {
            model: db.evicted,
          },
        ],
      })
      .then((data) => {
        const male = [];
        const female = [];
        data.forEach((element) => {
          if (element.gender == "male") {
            male.push(element);
          } else {
            female.push(element);
          }
        });
        res.status(200).send({
          success: true,
          message: "All trainees retrieved successfully",
          data: data,
          maleReport: male,
          femaleReport: female,
          maleCount: male.length,
          femaleCount: female.length,
          length: data.length,
        });
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
        });
      });
  },

  getTraineesbyGradStatus: (req, res) => {
    const po = req.body.partnerorganisationId;
    const graduationStatus = req.body.graduationStatus;
    if (po == "all") {
      var condition = { graduationStatus: graduationStatus };
    } else if (graduationStatus == "all") {
      var condition = { partnerorganisationId: po };
    } else {
      var condition = {
        [Op.and]: [
          { partnerorganisationId: po },
          { graduationStatus: graduationStatus },
        ],
      };
    }
    beneficiaries
      .findAll({
        where: {
          condition,
        },
        include: [
          {
            model: db.partnerOrganisation,
          },
          {
            model: db.trainingCategories,
          },
          {
            model: db.trainingBatch,
          },
          {
            model: db.employ,
          },
          {
            model: db.evicted,
          },
        ],
      })
      .then((data) => {
        const male = [];
        const female = [];
        data.forEach((element) => {
          if (element.gender == "male") {
            male.push(element);
          } else {
            female.push(element);
          }
        });
        res.status(200).send({
          success: true,
          message: "All trainees retrieved successfully",
          data: data,
          maleReport: male,
          femaleReport: female,
          maleCount: male.length,
          femaleCount: female.length,
          length: data.length,
        });
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
        });
      });
  },
};

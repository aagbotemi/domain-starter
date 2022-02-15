const db = require("../models/index");
const bcrypt = require("bcryptjs");
const { constants } = require("./constants");
const { pagination} = require("./pagination");
const readXlsxFile = require("read-excel-file/node");
const beneficiaries = db.beneficiaries;
const { auditTrailController } = require("./auditTrail");
const { evictedController } = require("./evicted");
const { employController } = require("./employ");
const { usersController } = require("./users");
const { fileUploadController } = require("../controllers/fileUpload");

const { Op } = require("sequelize");

// const department = db.department;
require("dotenv").config();

exports.beneficiariesController = {
  importFromExcel: (req, res) => {
    const pathToExcel = fileUploadController.upload(req);
    readXlsxFile(pathToExcel).then((rows) => {
      beneficiaries
        .bulkCreate(rows)
        .then((datas) => {
          datas.forEach((data) => {
            const userData = {
              fullName: `${data.firstName} ${data.lastName} ${data.middleName}`,
              email: data.email,
              phoneNumber: data.phoneNumber,
              password: data.firstName,
              userName: data.firstName,
              userType: "beneficiary",
              partnerorganisationId: data.partnerorganisationId,
            };

            usersController.create(userData).then((data) => {
              const userId = data.id;
              beneficiaries.update(userId, {
                where: {
                  email: data.email,
                },
              });
            });
            trail = {
              userId: `${req.userId}`,
              action: `${req.body.firstName} ${req.body.lastName} added as a trainee`,
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
          });
          res.status(200).send({
            success: true,
            message: "Trainee Added Successfully",
            data: datas,
          });
        })
        .catch((err) => {
          constants.handleErr(err, res);
        });
    });
  },

  createTrainee: (req, res) => {
    const trainee = req.body;
    const userData = {
      fullName: `${req.firstName} ${req.lastName} ${req.middleName}`,
      email: req.email,
      phoneNumber: req.phoneNumber,
      password: req.firstName,
      userName: req.firstName,
      userType: "beneficiary",
      partnerorganisationId: req.partnerorganisationId,
    };
    usersController
      .create(userData)

      .then((data) => {
        trainee.userId = data.id;
        beneficiaries.create(trainee);

        trail = {
          userId: `${req.userId}`,
          action: `${req.body.firstName} ${req.body.lastName} added as a trainee`,
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
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
        });
      });
  },

  getAllBeneficiaries: (req, res) => {
    const { page, size } = req.query;

    const { limit, offset } = pagination.getPagination(page, size);
    beneficiaries
      .findAndCountAll({
        limit,
        offset,
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
        data.rows.forEach((element) => {
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
        const response = pagination.getPagingData(data, page, limit);
        response.report = report;

        res.status(200).send(response);
        // res.status(200).send({

        //   success: true,
        //   message: "All trainees retrieved successfully",
        //   report,
        //   length: data.length,
        //   data,
        // });
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
        });
      });
  },

  getAllBeneficiariesbyYear: (req, res) => {
    const startedDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    beneficiaries
      .findAndCountAll(
        {
          where: {
            trainingYear: {
              $between: [startedDate, endDate],
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
        data.rows.forEach((element) => {
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
    const { page, size } = req.query;

    const { limit, offset } = pagination.getPagination(page, size);
    beneficiaries
      .findAndCountAll({
        limit,
        offset,
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
        data.rows.forEach((element) => {
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

        const response = pagination.getPagingData(data, page, limit);
        response.report = report;

        res.status(200).send(response);

        // res.status(200).send({
        //   success: true,
        //   message: "All trainees retrieved successfully",
        //   report,
        //   data,
        //   length: data.length,
        // });
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
        });
      });
  },

  getPOTraineesbyYearRange: (req, res) => {
    const startedDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    beneficiaries
      .findAndCountAll({
        where: {
          trainingYear: {
            $between: [startedDate, endDate],
          },
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
          action: `A trainee details has been updated`,
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
    const state = req.body.stateOfOrigin;
    const { page, size } = req.query;

    const { limit, offset } = pagination.getPagination(page, size);
    if (po == "all" && state != "all") {
      var condition = { stateOfOrigin: state };
    } else if (state == "all" && po != "all") {
      var condition = { partnerorganisationId: po };
    } else if (po == "all" && state == "all") {
      var condition = null;
    } else {
      var condition = {
        [Op.and]: [{ partnerorganisationId: po }, { stateOfOrigin: state }],
      };
    }
    beneficiaries
      .findAndCountAll({
        limit,
        offset,
        where: condition,

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
        data.rows.forEach((element) => {
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

        const response = pagination.getPagingData(data, page, limit);
        response.report = report;

        res.status(200).send(response);
        // res.status(200).send({
        //   success: true,
        //   message: "All trainees retrieved successfully",
        //   data: data,
        //   maleReport: male,
        //   femaleReport: female,
        //   maleCount: male.length,
        //   femaleCount: female.length,
        //   length: data.length,
        // });
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
    const { page, size } = req.query;

    const { limit, offset } = pagination.getPagination(page, size);
    if (po == "all" && gender != "all") {
      var condition = { gender: gender };
    } else if (gender == "all" && po != "all") {
      var condition = { partnerorganisationId: po };
    } else if (po == "all" && gender == "all") {
      var condition = null;
    } else {
      var condition = {
        [Op.and]: [{ partnerorganisationId: po }, { gender: gender }],
      };
    }
    beneficiaries
      .findAndCountAll({
        limit,
        offset,
        where: condition,

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
        data.rows.forEach((element) => {
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

        const response = pagination.getPagingData(data, page, limit);
        response.report = report;
        res.status(200).send(response);

        // res.status(200).send({
        //   success: true,
        //   message: "All trainees retrieved successfully",
        //   data: data,
        //   maleReport: male,
        //   femaleReport: female,
        //   maleCount: male.length,
        //   femaleCount: female.length,
        //   length: data.length,
        // });
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
    const { page, size } = req.query;

    const { limit, offset } = pagination.getPagination(page, size);
    if (po == "all" && categoryId != "all") {
      var condition = { categoryId: categoryId };
    } else if (categoryId == "all" && po != "all") {
      var condition = { partnerorganisationId: po };
    } else if (po == "all" && categoryId == "all") {
      var condition = null;
    } else {
      var condition = {
        [Op.and]: [{ partnerorganisationId: po }, { categoryId: categoryId }],
      };
    }
    beneficiaries
      .findAndCountAll({
        limit,
        offset,
        where: condition,

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
        const employed = [];
        const selfEmploy = [];
        const unemploy = [];

        data.rows.forEach((element) => {
          if (element.employmentStatus == "employed") {
            employed.push(element);
          } else if (element.employmentStatus == "self employed") {
            selfEmploy.push(element);
          } else {
            unemploy.push(element);
          }
        });

        const report = {
          unemployCount: unemploy.length,
          employCount: employed.length,
          selfEmployCount: selfEmploy.length,
        };

        const response = pagination.getPagingData(data, page, limit);
        response.report = report;
        res.status(200).send(response);

        // res.status(200).send({
        //   success: true,
        //   message: "All trainees retrieved successfully",
        //   data: data,
        //   unemployCount: unemploy.length,
        //   employCount: employed.length,
        //   selfEmployCount: selfEmploy.length,
        //   length: data.length,
        // });
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
    const { page, size } = req.query;

    const { limit, offset } = pagination.getPagination(page, size);
    if (po == "all" && graduationStatus != "all") {
      var condition = { graduationStatus: graduationStatus };
    } else if (graduationStatus == "all" && po != "all") {
      var condition = { partnerorganisationId: po };
    } else if (po == "all" && graduationStatus == "all") {
      var condition = null;
    } else {
      var condition = {
        [Op.and]: [
          { partnerorganisationId: po },
          { graduationStatus: graduationStatus },
        ],
      };
    }
    beneficiaries
      .findAndCountAll({
        limit,
        offset,
        where: condition,

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
        const graduated = [];
        const inTraining = [];
        const exited = [];
        const droppedOut = [];

        data.rows.forEach((element) => {
          if (element.graduationStatus == "graduated") {
            graduated.push(element);
          } else if (element.graduationStatus == "in-training") {
            inTraining.push(element);
          } else if (element.graduationStatus == "exited") {
            exited.push(element);
          } else {
            droppedOut.push(element);
          }
        });

        const report = {
          graduated: graduated.length,
          inTraining: inTraining.length,
          exited: exited.length,
          droppedOut: droppedOut.length,
        };

        const response = pagination.getPagingData(data, page, limit);
        response.report = report;
        res.status(200).send(response);
        // res.status(200).send({
        //   success: true,
        //   message: "All trainees retrieved successfully",
        //   data: data,
        //   graduated: graduated.length,
        //   inTraining: inTraining.length,
        //   exited: exited.length,
        //   droppedOut: droppedOut.length,
        //   length: data.length,
        // });
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
        });
      });
  },
};

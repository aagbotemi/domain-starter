const db = require("../models/index");
const bcrypt = require("bcryptjs");
const { constants } = require("./constants");
const partnerOrganisation = db.partnerOrganisation;
const { auditTrailController } = require("./auditTrail");

require("dotenv").config();

exports.partnerOrgController = {
  createPartnerOrg: async (req, res) => {
    try{
      const po = req.body;

      const participatingOrg = await partnerOrganisation.create(po);
      participatingOrg
        .setCategories(po.categories)
        .then((data) => {
          trail = {
            userId: `${req.userId}`,
            action: ` ${req.body.organisationName} has been created successfully`,
            type: "success",
          }
          auditTrailController.create(trail)
          res.status(200).send({
            success: true,
            message: "Partner Organisation Added Successfully",
            data: data,
          });
        })
        .catch((err) => {
          constants.handleErr(err, res);
        });
    }catch(err){
      constants.handleErr(err, res);
      
    }
    
  },

  getById: (req, res) => {
    partnerOrganisation
      .findOne(
        {
          where: {
            id: req.params.id,
          },
        },
        {
          include: [
            {
              model: db.trainingCategories,
            },
          ],
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

  getAllPartnerOrg: (req, res) => {
    partnerOrganisation
      .findAll({
        include: [
          {
            model: db.trainingCategories
           
          },
        ],
      })
      .then((data) => {
        res.status(200).send({
          success: true,
          message: "All partner Organisation retrieved successfully",
          data,
        });
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
        });
      });
  },

  updatePartnerOrgCategories: (req, res) => {
    db.partnerOrganisation
      .findOne({
        where: {
          id: req.params.id,
        },
      })
      .then((data) => {
        db.trainingCategories.findAll({where: {id: req.body.categories}})
        .then((data2) => {
          data.setCategories(data2)

          trail = {
            userId: `${req.userId}`,
            action: `A partner organisation has been updated`,
            type: "warning",
          };
          auditTrailController.create(trail);

          res.status(200).send({ message: "Record Updated" });
        })
        .catch((err) => {
          constants.handleErr(err, res);
        });

      })
      .catch((err) => {
        constants.handleErr(err, res);
      });
  },

  updatePartnerOrgStates: (req, res) => {
 

    db.partnerOrganisation
      .findOne({
        where: {
          id: req.params.id,
        },
      })
      .then((data) => {
        db.states.findAll({where: {id: req.body.stateId}})
        .then((data2) => {
          data.setStates(data2)

          trail = {
            userId: `${req.userId}`,
            action: `A category name has been updated`,
            type: "warning",
          };
          auditTrailController.create(trail);

          res.status(200).send({ message: "Record Updated" });
        })
        .catch((err) => {
          constants.handleErr(err, res);
        });

      })
      .catch((err) => {
        constants.handleErr(err, res);
      });
  },

  updatePartnerOrg: (req, res) => {
    const po = req.body;

    partnerOrganisation
      .update(po, {
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
          action: `A partner organisation has been updated successfully`,
          type: "warning",
        }
        auditTrailController.create(trail)
        res.status(200).send({ message: "Record Updated" });
      })
      .catch((err) => {
        constants.handleErr(err, res);
      });
  },
  delete: (req, res) => {
    partnerOrganisation
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
          action: `A partner organisation has been deleted successfully`,
          type: "danger",
        }
        auditTrailController.create(trail)
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

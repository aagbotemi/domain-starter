const db = require("../models");
const evicted = db.evicted;
const user = db.users;
const beneficiaries = db.beneficiaries;

exports.evictedController = {
  create: (evictInfo) => {
    evicted
      .create(evictInfo)
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
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
    const evictedInfo = req.body;
    evicted
      .update(evictedInfo, {
        where: {
          beneficiaryId: req.params.id,
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
          action: ` evicted details zone has been updated`,
          type: "warning",
        };
        auditTrailController.create(trail);
        res.status(200).send({ message: "Record Updated" });
      })
      .catch((err) => {
        constants.handleErr(err, res);
      });
  },
};

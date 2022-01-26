const db = require("../models");
const employ = db.employ;
const user = db.users;
const beneficiaries = db.beneficiaries;

exports.employController = {
  create: (employInfo) => {
    employ
      .create(employInfo)
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
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
    const employInfo = req.body;
    employ
      .update(employInfo, {
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
          action: ` employment details zone has been updated`,
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

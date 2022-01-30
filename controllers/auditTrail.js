const db = require("../models");
const auditTrail = db.auditTrail;
const user = db.users;
const partnerOrganisation = db.partnerOrganisation;
const beneficiaries = db.beneficiaries;

exports.auditTrailController = {
    create:(trail) => {
        auditTrail.create(trail)
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                console.log(err)
            });
    },
    getAuditPerUser:(req, res) => {
        auditTrail.findAll({
            where: {
                userId: req.userId,
            },
            include: [
                {
                    model: user,
                },
                {
                    model: beneficiaries,
                },
                {
                    model: partnerOrganisation,
                },
            ],
        })
        .then(data => {
            res.status(200).send({
                status: true,
                length: data.length,
                data,
            })
        })
        .catch(err => {
            res.status(400)
                .send({
                    status: false,
                    message: err.message || "Could not fetch record"
                })
        })
    },
    getAuditForAdmin:(req, res) => {
        auditTrail.findAll({
            include: [
                {
                    model: user,
                },
                {
                    model: beneficiaries,
                },
                {
                    model: partnerOrganisation,
                },
            ],
        })
        .then(data => {
            res.status(200).send({
                status: true,
                length: data.length,
                data,
            })
        })
        .catch(err => {
            res.status(400)
                .send({
                    status: false,
                    message: err.message || "Could not fetch record"
                })
        })
    },
}
const db = require('../models');
const { constants } = require('./constants')
const geoPoliticalZones = db.geoPoliticalZones;
const { auditTrailController } = require("./auditTrail");

exports.geoPoliticalZonesController = {
    create:(req, res) => {
        const zone = req.body;
        geoPoliticalZones.create(zone)
            .then(data => {
                trail = {
                    userId: `${req.userId}`,
                    action: ` ${req.body.geoPoliticalZoneName} zone has been created successfully`,
                    type: "success",
                }
                auditTrailController.create(trail)
                res.status(200).send({
                    success: true,
                    message: "GeoPolitical Zones Added Successfully",
                    data: data
                })
            })
            .catch(err => {
                constants.handleErr(err, res);
            })
    },
    getAll:(req, res) => {
        geoPoliticalZones.findAll()
            .then(data => {
                if(data.length == 0) {
                    res.status(404).send({
                        status: false,
                        message: "No GeoPolitical Zone has been created!!!"
                    })
                }
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
    getById:(req, res) => {
        geoPoliticalZones.findOne({
            where: {
                id: req.params.id
            }})
            .then(data =>{
                if(data == undefined) {
                    res.status(404).send({
                        status: false,
                        message: "record not found"
                    })
                }
                res.status(200).send({
                    status: true,
                    data,
                });
            }).catch(err => {
                res.status(400)
                    .send({
                        status: false,
                        message: err.message || "Could not fetch record"
                    })
        })
    },
    update:(req, res) => {
        const zone = req.body
        geoPoliticalZones.update(zone, {
            where: {
                id: req.params.id
            }})
            .then(data => {
                if(data[0] !== 1) {
                    res.status(404).send({
                        status: false,
                        message:"record not found"
                    })
                }
                trail = {
                    userId: `${req.userId}`,
                    action: `A Geopolitical Zone zone has been updated`,
                    type: "warning",
                }
                auditTrailController.create(trail)
                res.status(200)
                    .send(data);
            })
            .catch(err => {
                constants.handleErr(err, res)
            })
    },
    delete:(req, res) => {
        geoPoliticalZones.destroy({
            where: {
                id: req.params.id
            }})
            .then(data => {
                if(data !== 1) {
                    res.status(404).send({
                        status: false,
                        message:"record not found"
                    })
                }
                trail = {
                    userId: `${req.userId}`,
                    action: `A Geopolitical zone has been deleted`,
                    type: "danger",
                }
                auditTrailController.create(trail)
                res.status(200)
                    .send({
                        status: true,
                        message: "record deleted"
                    });
            })
            .catch(err => {
                constants.handleErr(err, res)
            })
    },
}
const db = require('../models');
const { constants } = require('./constants')
const roles = db.roles;
const { auditTrailController } = require("./auditTrail");

exports.rolesController = {
    create:(req, res) => {
        const role = req.body;
        roles.create(role)
            .then(data => {
                trail = {
                    userId: `${req.userId}`,
                    action: ` ${req.body.roleName} has been created successfully`,
                    type: "success",
                }
                auditTrailController.create(trail)
                res.status(200).send({
                    success: true,
                    message: "Role Added Successfully",
                    data: data
                })
            })
            .catch(err => {
                constants.handleErr(err, res);
            })
    },
    getAll:(req, res) => {
        roles.findAll()
            .then(data => {
                if(data.length == 0) {
                    res.status(404).send({
                        status: false,
                        message: "No role has been created!!!"
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
        roles.findOne({
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
        const role = req.body
        roles.update(role, {
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
                    action: `A role has been updated successfully`,
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
        roles.destroy({
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
                    action: `A role has been deleted successfully`,
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
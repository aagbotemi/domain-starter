const db = require('../models');
const { constants } = require('./constants')
const cities = db.cities;
const states = require('../models/states');
const { auditTrailController } = require("./auditTrail");

exports.citiesController = {
    create:(req, res) => {
        const city = req.body;
        cities.create(city)
            .then(data => {
                trail = {
                    userId: `${req.userId}`,
                    action: ` ${req.body.cityName} city created`,
                    type: "success",
                }
                auditTrailController.create(trail)
                res.status(200).send({
                    success: true,
                    message: "City Added Successfully",
                    data: data
                })
            })
            .catch(err => {
                constants.handleErr(err, res);
            })
    },
    getAll:(req, res) => {
        cities.findAll()
            .then(data => {
                if(data.length == 0) {
                    res.status(404).send({
                        status: false,
                        message: "No city has been created!!!"
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
        cities.findOne(
            {
                where: {
                    id: req.params.id
                }
            },
            {
                include: {
                    model: states,
                },
            }
        )
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
    getStateById:(req, res) => {
        cities.findAll(
            {
                where: {
                    stateId: req.params.id
                }
            },
            {
                include: {
                    model: states,
                },
            }
        )
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
        const city = req.body
        cities.update(city, {
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
                    action: `A city has been updated`,
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
        cities.destroy({
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
                    action: "A city was deleted",
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
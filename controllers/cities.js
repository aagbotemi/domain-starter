const db = require('../models');
const { constants } = require('./constants')
const cities = db.cities;

exports.citiesController = {
    create:(req, res) => {
        const city = req.body;
        cities.create(city)
            .then(data => {
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
        cities.findOne({
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
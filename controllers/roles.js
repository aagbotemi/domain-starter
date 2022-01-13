const db = require('../models');
const { constants } = require('../utils/constants')
const roles = db.roles;

exports.rolesController = {
    create:(req, res) => {
        const role = req.body;
        roles.create(role)
            .then(data => {
                res.status(200)
                    .send(data)
            })
            .catch(err => {
                constants.handleError(err, res);
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
                res.status(200)
                    .send(data);
            })
            .catch(err => {
                constants.handleError(err, res)
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
                res.status(200)
                    .send({
                        status: true,
                        message: "record deleted"
                    });
            })
            .catch(err => {
                constants.handleError(err, res)
            })
    },
}
const db = require('../models');
const { constants } = require("./constants");
const users = db.users;
const Role = db.roles;

const Op = db.Sequelize.Op;

exports.usersController = {
    create:(req, res) => {
        const user = req.body;
        user.password = bcrypt.hashSync(user.password, 10);
        users.create(user)
            .then(role => { 
                if (req.body.roles) {
                    Role.findAll({
                        where: {
                            roleName: {
                                [Op.or]: req.body.roles
                            }
                        }
                    }).then(roles => {
                        role.setRoles(roles).then(() => {
                            res.status(200).send({
                                message: "User was registered successfully!"
                            })
                        })
                    }) 
                } else {
                    role.setRoles([1]).then(() => {
                        res.status(200).send({ message: "User was registered successfully!" });
                    });
                }
            })
            .catch(error => {
                res.status(500).send({
                    message: error.message
                })
            })
            // .then(data => {
            //     res.status(200)
            //         .send(data)
            // })
            // .catch(err => {
            //     constants.handleError(err, res);
            // })
    },
    getAll:(req, res) => {
        users.findAll()
            .then(data => {
                if(data.length == 0) {
                    res.status(404).send({
                        status: false,
                        message: "No course has been created!!!"
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
        users.findOne({
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
        const user = req.body
        users.update(user, {
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
        users.destroy({
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
const db = require('../models');
const { constants } = require('./constants')
const bcrypt = require('bcryptjs');
const { sign } = require('jsonwebtoken');

const Users = db.users;
const Roles = db.roles;
const config = require('../config/auth');


const Op = db.Sequelize.Op;


exports.authController = {
    signin:(req, res) => {
        Users.findOne({
            where: {
                userName: req.body.userName
            }
        }).then(user => {
            // if record doesn't exist
            if (!user) {
                return res.status(401).send({
                    message: 'Invalid username or password'
                })
            }

            // compare the request password with the hashed password saved in the database
            let passwordIsValid  = bcrypt.compareSync(req.body.password, user.password)

            // if password is not valid
            if (!passwordIsValid ) {
                return res.status(401).send({
                    accessToken: null,
                    message: 'Invalid username or password'
                })
            }

            let payload = {
                id: user.id,
                userName: user.userName,
                userType: user.userType
            }
            let token = sign(payload, config.secretKey, {
                expiresIn: 36000
            })

            let authorities = [];
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push("ROLE_" + roles[i].name.toUpperCase());
                }
                res.status(200).send({
                    id: user.id,
                    userData: payload,
                    roles: authorities,
                    accessToken: token
                });
            });
        }).catch(err => {
            res.status(400)
                .send({
                    status: false,
                    message: err.message || "Could not fetch record"
                })
        })
    }
}
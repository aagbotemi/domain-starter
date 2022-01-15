const { jwt, verify } = require('jsonwebtoken');
const config = require('../config/auth');
const db = require("../models");
const ROLES = db.ROLES;
const User = db.users;

verifyToken = (req, res, next) => {
    let token = req.headers['Authorization']

    // if token doesn't exist, reject request
    if (!token) {
        return res.status(403).send({
            message: 'Forbidden'
        })
    }

    // if token exist, validate
    // verify(token, 'secretKey')
    verify(token, config.secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: 'Unauthorized Access'
            })
        }

        req.userId = decoded.id

        next();
    })
}

isAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "admin") {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: "Require Admin Role!"
            });
            return;
        });
    });
};

isPO = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "PO") {
                next();
                return;
                }
            }

            res.status(403).send({
                message: "Require PO Role!"
            });
        });
    });
};

isAdminOrPO = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "moderator") {
                    next();
                    return;
                }

                if (roles[i].name === "admin") {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: "Require PO or Admin Role!"
            });
        });
    });
};

const jwtAuth = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isPO: isPO,
    isAdminOrPO: isAdminOrPO
}

module.exports = jwtAuth;

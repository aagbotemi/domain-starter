const db = require("../models");
const evicted = db.evicted;
const user = db.users;
const beneficiaries = db.beneficiaries;

exports.evictedController = {
    create:(evictInfo) => {
        evicted.create(evictInfo)
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                console.log(err)
            });
    },
    getAll:(req, res) => {
        evicted.findAll({
            include: [{
                model: beneficiaries, 
                
            }],
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
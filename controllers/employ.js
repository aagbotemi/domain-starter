const db = require("../models");
const employ = db.employ;
const user = db.users;
const beneficiaries = db.beneficiaries;

exports.employController = {
    create:(employInfo) => {
        employ.create(employInfo)
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                console.log(err)
            });
    },
    getAll:(req, res) => {
        employ.findAll({
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
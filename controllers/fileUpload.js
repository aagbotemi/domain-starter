const fs = require("fs");
const path = require("path");
const db = require('../models');
const fileUpload = db.fileUpload
const { upload } = require("../middleware/upload");

exports.fileUploadController = {
    upload:(req, res) => {
        res.send("File Uploaded Successfully")
        console.log(res);
    },



    getFile: (req, res) => {
        res.sendFile(path.join(`${__dirname}/../views/index.html`))
    },
}
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { jwtAuth } = require("../middleware/auth");

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename(req, file, cb){
        cb(null, `${file.fieldname}${Date.now()}${path.extname(file.originalname)}`)
    }
})

function checkFileType(file, cb){
    const filetypes = /jpg|jpeg|png|pdf/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if(extname && mimetype){
        return cb(null, true)
    }else {
        cb('Unsupported file type')
    }
}

router.post("/",
    jwtAuth.generalVerifyToken,
    (req, res) => {
    const upload = multer({
        storage: storage,
        fileFilter: function (req, file, cb) {
            checkFileType(file, cb)
        }
    }).single("file")
    upload(req, res, function(err) {
        
        if (req.fileValidationError) {
            return res.status(400).send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.status(400).send('Please select a file to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.status(400).send(err);
        }
        else if (err) {
            return res.status(400).send(err);
        }
        // Display uploaded image for user validation
        res.send(`${req.file.path}`);
    });
});

module.exports = router;

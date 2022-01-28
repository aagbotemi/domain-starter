const express = require("express");
const router = express.Router();
const { fileUploadController } = require("../controllers/fileUpload");
const { jwtAuth } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

router.post(
    "/",
    // jwtAuth.generalVerifyToken,
    (req, res) => {
    upload(req, res, function(err) {

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }

        // Display uploaded image for user validation
        res.send(`${req.file.path}`);
    });
});

router.get("/", jwtAuth.generalVerifyToken, fileUploadController.getFile);

module.exports = router;

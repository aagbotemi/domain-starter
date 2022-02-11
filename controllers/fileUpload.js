const express = require("express");
const multer = require("multer");
const path = require("path");

exports.fileUploadController = {
  upload: (req, res) => {
    const storage = multer.diskStorage({
      destination(req, file, cb) {
        cb(null, "./public/uploads/");
      },
      filename(req, file, cb) {
        cb(
          null,
          `${file.fieldname}${Date.now()}${path.extname(file.originalname)}`
        );
      },
    });

    function checkFileType(file, cb) {
      const filetypes = /jpg|jpeg|png|pdf|xlsx/;
      const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
      );
      const mimetype = filetypes.test(file.mimetype);

      if (extname && mimetype) {
        return cb(null, true);
      } else {
        cb("Unsupported file type");
      }
    }
    const upload = multer({
      storage: storage,
      fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
      },
    }).single("file");
    
    upload(req, res, function (err) {
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      } else if (!req.file) {
        return res.status(400).send("Please select a file to upload");
      } else if (err instanceof multer.MulterError) {
        return res.status(400).send(err);
      } else if (err) {
        return res.status(400).send(err);
      }
      // remove the public(string) before the first slash
      let path = req.file.path;
      const pathToReturn = path.substring(path.indexOf("/") + 1);
      res.send(pathToReturn);
      return pathToReturn;
    });
  },
};

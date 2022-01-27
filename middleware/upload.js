const multer = require("multer")
const path = require("path")


const storage = multer.diskStorage({
    // destination:"./src/image/"
    destination(req, file, cb) {
        cb(null, 'images')
    },
    filename(req, file, cb){
        cb(null, `${Date.now()}${path.extname(file.originalname)}`)
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

const upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: "5000000"
  // },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  }
})

module.exports = {upload};
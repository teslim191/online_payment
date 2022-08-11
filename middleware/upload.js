const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + Date.now() + ext);
    }
})

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        }
        else{
            console.log('only jpeg and png are supported');
            cb(null, false);
        }

        },
    limits: {
        fileSize: 1024 * 1024 * 5
    }

})

module.exports = upload
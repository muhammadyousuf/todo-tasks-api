const express = require("express");
const router = express.Router();
const multer = require('multer');
const User_Controller = require("../controller/user");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'image/')
    },
    filename: function (req, file, cb) {
        var now = new Date().toISOString();
        now = now.replace(/:/g, "-");

        cb(null, now + file.originalname.toString());
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }


}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

router.post("/signup", User_Controller.create_user);

router.post("/login", User_Controller.login_user);

router.get("/:user", User_Controller.get_user);

router.put("/:user",upload.single('userImage'), User_Controller.update_user);

module.exports = router;

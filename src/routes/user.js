const express = require("express");
const router = express.Router();

const User_Controller = require("../controller/user");

router.post("/signup", User_Controller.create_user);

router.post("/login", User_Controller.login_user);

router.get("/:user", User_Controller.get_user);

module.exports = router;

const express = require("express");
const router = express.Router();

const Task_Controller = require("../controller/task");

router.post("/", Task_Controller.create_task);

router.get("/", Task_Controller.get_all_task);

module.exports = router;

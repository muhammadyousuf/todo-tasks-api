const express = require("express");
const router = express.Router();

const Task_Controller = require("../controller/task");

router.post("/:user", Task_Controller.create_task);

router.get("/:user", Task_Controller.get_all_task);

router.get("/:user/task/:taskId", Task_Controller.get_single_task);

router.delete("/:user/task/:taskId", Task_Controller.delete_task);

//router.patch("/:user/task/:taskId", Task_Controller.update_task);

module.exports = router;

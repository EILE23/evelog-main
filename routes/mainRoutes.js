const controller = require("../controller/Cmain.js");
const express = require("express");
const router = express.Router();

router.get("/", controller.main);

module.exports = router;

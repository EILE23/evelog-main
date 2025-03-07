const express = require("express");
const router = express.Router();
const controller = require("../controller/Cdetail");

router.get("/post/:postId", controller.getPostDetail);

module.exports = router;

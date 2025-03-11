const express = require("express");
const router = express.Router();
const controller = require("../controller/Cdetail");

router.get("/post/:postId", controller.getPostDetail);
router.get("/evelog", controller.getVelog);
router.get("/getPost", controller.postGet);

module.exports = router;

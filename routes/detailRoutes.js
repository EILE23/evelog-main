const express = require("express");
const router = express.Router();
const controller = require("../controller/Cdetail");

router.get("/post/:postId", controller.getPostDetail);
router.get("/evelog", controller.getVelog);
router.get("/getPost", controller.postGet);

router.post("/commentRequest", controller.getComment);
router.post("/like", controller.getLike);
router.post("/checkLike", controller.likeCheck);
router.post("/commentPush", controller.pushComment);

router.delete("/likeDel", controller.dontLike);

module.exports = router;

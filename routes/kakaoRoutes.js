const controller = require("../controller/Cmain.js");
const express = require("express");
const router = express.Router();

router.get("/kakao/callback", controller.checkNaver);

router.post("/checkKakao", controller.checkKakao);

module.exports = router;

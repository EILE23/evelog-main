const controller = require("../controller/Cmain.js");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 업로드할 폴더 경로
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // 원본 파일명 그대로 저장
  },
});

const upload = multer({ storage });

router.get("/write", controller.write);
router.get("/", controller.main);
router.post("/idCheck", controller.checkId);
router.post("/getData", upload.none(), controller.getData);
router.post("/login", controller.checkLogin);
router.get("/logout", controller.logout);
router.get("/join", controller.join);
router.get("/checkCookie", controller.cookieCheck);
router.get("/categories", controller.getCategory);
router.get("/contentGet", controller.getContent);
router.get("/infoPage", controller.info);
router.get("/likePage", controller.like);
router.post("/idinfo", controller.getOneId);
router.post("/findEmail", controller.findId);
router.post("/findPass", controller.findPw);
router.post("/passwordChange", controller.changePw);
router.post("/getFile", upload.single("file"), controller.fileUpload);
router.delete("/delFile", controller.fileRemove);
router.get("/detail", controller.detail);

module.exports = router;

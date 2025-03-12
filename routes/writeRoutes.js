const controller = require("../controller/Cwrite.js");
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

router.get("/categories", controller.getCategory);
router.get("/checkCookie", controller.cookieCheck);
router.get("/content/:userId", controller.exportContentByUser);
router.get("/search", controller.searchPage);

router.post("/saveData", upload.single("file"), controller.createData);
router.post("/likeP", controller.getLikePost);
router.post("/recentP", controller.getRecentPost);

module.exports = router;

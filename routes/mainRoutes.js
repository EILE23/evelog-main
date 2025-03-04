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
    // 원본 파일명에서 확장자 추출
    const ext = path.extname(file.originalname);
    // 파일명에 타임스탬프와 확장자 포함시켜 저장
    let num = Math.floor(Math.random() * 100) + 1;
    cb(null, String(num) + ext); // timestamp + 확장자
  },
});

const upload = multer({ storage });

router.get("/", controller.main);
router.post("/getData", upload.none(), controller.getData);

module.exports = router;

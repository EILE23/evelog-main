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
    const basename = path.basename(
      file.originalname,
      path.extname(file.originalname)
    ); // 확장자 제외한 파일명
    const ext = path.extname(file.originalname); // 확장자
    const timestamp = Date.now(); // 현재 타임스탬프

    // 중복 체크: 해당 파일이 이미 존재하는지 확인
    const newFilename = basename + "_" + timestamp + "_" + ext;

    // 파일명에 타임스탬프를 추가하여 중복을 방지
    cb(null, newFilename);
  },
});

const upload = multer({ storage });

//route to 'write page'
router.get("/write", controller.write);
//route to 'category'
router.get("/categories", controller.getCategory);
router.post("/saveData", controller.createData);
router.get("/", controller.main);
router.post("/idCheck", controller.checkId);
router.post("/getData", upload.none(), controller.getData);
router.post("/login", controller.checkLogin);
router.get("/join", controller.join);

module.exports = router;

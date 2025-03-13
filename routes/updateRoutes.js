const controller = require("../controller/Cupdate.js");
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

router.get("/getEditPost/:id", controller.getEditPost);
router.get("/edit", controller.editPage);

router.post("/updateEdit", controller.updateEdit);
router.post("/updatePass", controller.updatePass);
router.post("/updateAddress", controller.updateAddress);
router.post("/updateTitle", controller.updateTitle);
router.post("/getFile", upload.single("file"), controller.fileUpload);
router.post("/userDestroy", controller.userDestroy);
router.post("/getmypost", controller.getMypost);
router.post("/postDestroy", controller.postDestroy);

router.delete("/delFile", controller.fileRemove);

module.exports = router;

require("dotenv").config();

const models = require("../models");
const bcrypt = require("bcryptjs");
const salt = 10;
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const marked = require("marked");
const axios = require("axios");
let joinData = null;

marked.setOptions({
  breaks: true, // 줄바꿈 유지
});
const bcryptPass = (pw) => {
  if (!pw) {
    return null;
  }
  return bcrypt.hashSync(pw, salt);
};
const bcryptCompare = (pw, dbpw) => {
  return bcrypt.compareSync(pw, dbpw);
};
const jwtToken = (email) => {
  const token = jwt.sign({ email: email }, secret, { expiresIn: `1h` });
  return token;
};

const fileUpload = async (req, res) => {
  try {
    const src = req.body.src;
    await models.User.update(
      { imgsrc: src },
      { where: { id: req.body.id }, raw: true }
    );

    res.json({ result: true, src: src });
  } catch (e) {
    console.error(e);
    res.json({ result: false });
  }
};

const fileRemove = async (req, res) => {
  try {
    if (!req.body.src) {
      await models.User.update(
        { imgsrc: null },
        { where: { id: req.body.id } }
      );
      res.json({ result: true });
    } else {
      res.json({ result: false });
    }
  } catch (e) {
    console.error(e);
    res.json({ result: false });
  }
};

const updateEdit = async (req, res) => {
  if (req.body) {
    try {
      await models.User.update(
        { comment: req.body.comment, nickname: req.body.nickname },
        { where: { id: req.body.id } }
      );
      res.json({ result: true, message: "변경 완료" });
    } catch (e) {
      console.error(e);
      res.json({ result: false, message: "올바르지 않은 요청입니다." });
    }
  } else {
    res.json({ result: false, message: "올바르지 않은 요청입니다." });
  }
};
const updatePass = async (req, res) => {
  if (req.body) {
    try {
      await models.User.update(
        { password: bcryptPass(req.body.password) },
        { where: { id: req.body.id } }
      );
      res.json({ result: true, message: "변경 완료" });
    } catch (e) {
      console.error(e);
      res.json({ result: false, message: "올바르지 않은 요청입니다." });
    }
  } else {
    res.json({ result: false, message: "올바르지 않은 요청입니다." });
  }
};
const updatePhone = async (req, res) => {
  if (req.body) {
    try {
      await models.User.update(
        { phone: req.body.phone },
        { where: { id: req.body.id } }
      );
      res.json({ result: true, message: "변경 완료" });
    } catch (e) {
      console.error(e);
      res.json({ result: false, message: "올바르지 않은 요청입니다." });
    }
  } else {
    res.json({ result: false, message: "올바르지 않은 요청입니다." });
  }
};

const updateAddress = async (req, res) => {
  if (req.body) {
    try {
      await models.User.update(
        { address: req.body.address },
        { where: { id: req.body.id } }
      );
      res.json({ result: true, message: "변경 완료" });
    } catch (e) {
      console.error(e);
      res.json({ result: false, message: "올바르지 않은 요청입니다." });
    }
  } else {
    res.json({ result: false, message: "올바르지 않은 요청입니다." });
  }
};

const updateTitle = async (req, res) => {
  if (req.body) {
    try {
      await models.User.update(
        { title: req.body.title },
        { where: { id: req.body.id } }
      );
      res.json({ result: true, message: "변경 완료" });
    } catch (e) {
      console.error(e);
      res.json({ result: false, message: "올바르지 않은 요청입니다." });
    }
  } else {
    res.json({ result: false, message: "올바르지 않은 요청입니다." });
  }
};

const userDestroy = async (req, res) => {
  try {
    await models.User.destroy({
      where: { email: req.body.email },
    });

    res.json({ result: true, message: "탈퇴 성공" });
  } catch (e) {
    res.json({ result: false, message: "탈퇴 실패" });
  }
};

const getMypost = async (req, res) => {
  try {
    const EMAIL = await models.User.findOne({ where: { vUrl: req.body.vUrl } });
    const post = await models.Data.findAll({ where: { email: EMAIL.email } });

    res.json({ post: post, user: EMAIL });
  } catch (e) {
    console.error(e);
  }
};

const postDestroy = async (req, res) => {
  try {
    await models.Data.destroy({ where: { id: req.body.id } });
    res.json({ result: true });
  } catch (e) {
    console.error(e);
  }
};

const editPage = (req, res) => {
  res.render("update");
};

const getEditPost = async (req, res) => {
  try {
    const post = await models.Data.findOne({
      where: { id: Number(req.params.id) },
    });
    post.content = marked.parse(post.content);
    res.json(post);
  } catch (e) {
    console.error(E);
  }
};

const postUpdate = async (req, res) => {
  try {
    let imgsrc = req.body.imgsrc;

    if (req.file) {
      imgsrc = `/uploads/${file.filename}`; // 파일 경로 설정
    }
    const check = await models.Data.update(
      {
        title: req.body.title,
        content: req.body.content,
        categoryId: req.body.categoryId,
        imgsrc: req.body.imgsrc,
        comment: req.body.comment,
        email: req.body.email,
      },
      {
        where: { id: Number(req.body.id) },
      }
    );
    if (check) {
      res.json({ result: true, message: "수정 완료" });
    } else {
      res.json({ result: false, message: "수정 실패" });
    }
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  updateAddress,
  updatePass,
  updateEdit,
  updateTitle,
  updatePhone,
  fileRemove,
  fileUpload,
  userDestroy,
  getMypost,
  postDestroy,
  editPage,
  getEditPost,
  postUpdate,
};

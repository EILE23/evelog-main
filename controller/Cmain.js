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

const main = (req, res) => {
  res.render("main");
};

const join = (req, res) => {
  res.render("join");
};

const info = (req, res) => {
  res.render("info");
};
const like = (req, res) => {
  res.render("like");
};

const detail = (req, res) => {
  res.render("detail");
};

const getData = async (req, res) => {
  console.log(req.body);
  try {
    const emailChc = await models.User.findOne({
      where: { email: req.body.userid },
    });

    if (emailChc) {
      return res.json({ result: false, message: "중복 이메일입니다." });
    }
    if (req.body) {
      const pw = bcryptPass(req.body.password);

      await models.User.create({
        email: req.body.userid,
        nickname: req.body.nickname,
        password: pw ? pw : null,
        username: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        src: "/public/img/user-thumbnail.png",
        title: "evelog",
        social: req.body.social ? req.body.social : "local",
      });
      res.json({ result: true });
    } else {
      res.json({ result: false, message: "잘못된 형식입니다." });
    }
  } catch (e) {
    console.error(e);
  }
};

const checkId = async (req, res) => {
  try {
    const data = await models.User.findOne({
      where: { email: req.body.email },
    });

    if (data) {
      res.json({ result: false, message: "중복 아이디입니다." });
    } else {
      res.json({ result: true, message: "사용 가능한 아이디입니다." });
    }
  } catch (e) {
    console.error(e);
  }
};

const checkLogin = async (req, res) => {
  console.log(req.body);
  try {
    const data = await models.User.findOne({
      where: { email: req.body.email },
    });
    console.log(data.password);
    const pwChc = bcryptCompare(req.body.password, data.password);
    if (pwChc && data) {
      const email = req.body.email;
      const token = jwtToken(email);

      res.cookie("token", token, { maxAge: 1000 * 60 * 60 });
      res.json({ result: true, message: "로그인 성공" });
    } else if (pwChc) {
      res.json({ result: false, message: "비밀번호가 틀립니다." });
    } else if (!data) {
      res.json({ result: false, message: "등록되지 않은 아이디입니다." });
    } else {
      res.json({ result: false, message: "등록되지 않은 아이디입니다." });
    }
  } catch (e) {
    console.error(e);
    res.json({ result: false, message: "올바르지 않은 형식입니다." });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};

const cookieCheck = async (req, res) => {
  if (req.cookies.token) {
    try {
      const check = jwt.verify(req.cookies.token, secret);
      const user = await models.User.findOne({
        where: { email: check.email },
      });
      let src = user.imgsrc;

      if (check) {
        res.json({
          result: true,
          email: check.email,
          src: src,
          social: user.social,
        });
        console.log("검증완료");
      } else {
        res.json({ result: false, message: "검증되지 않은 유저 입니다." });
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    res.json({ result: false, message: "검증되지 않은 이메일 입니다." });
  }
};

const write = (req, res) => {
  res.render("write");
};

const getCategory = async (req, res) => {
  try {
    const category = await models.Category.findAll({});
    res.json({ category: category });
  } catch (e) {
    res.send("error");
  }
};
const getContent = async (req, res) => {
  try {
    const content = await models.Data.findAll({ limit: 50 });
    const title = content.map((item) => item.title);
    const contentData = content.map((item) => marked.parse(item.content));
    const img = content.map((item) => item.imgsrc);
    const id = content.map((item) => item.id);
    const total = contentData.map((item, i) => ({
      title: title[i],
      img: img[i],
      id: id[i],
      text: item,
    }));

    res.json(total);
  } catch (e) {
    console.error(e);
    res.send(e);
  }
};

const getOneId = async (req, res) => {
  const IDdata = await models.User.findOne({
    where: { email: req.body.email },
  });
  res.json(IDdata);
};

const findId = async (req, res) => {
  try {
    const email = await models.User.findOne({
      where: { phone: req.body.phone },
    });
    res.json({ result: true, email: email.email });
  } catch (e) {
    res.json({ result: false });
  }
};

const findPw = async (req, res) => {
  try {
    const email = await models.User.findOne({
      where: { email: req.body.email },
    });
    if (email) {
      res.json({
        result: true,
        message: "비밀번호 변경을 할 수 있습니다",
        id: email.id,
      });
    } else {
      res.json({ result: false, message: "올바른 아이디가 아닙니다." });
    }
  } catch (e) {
    res.json({ result: false, message: "접근 실패" });
  }
};

const changePw = async (req, res) => {
  try {
    if (req.body) {
      const pw = bcryptPass(req.body.pw);
      await models.User.update(
        { password: pw },
        { where: { id: req.body.id } }
      );
      res.json({ result: true });
    }
  } catch (e) {
    console.error(e);
    res.json({ result: false, message: "검증 실패" });
  }
};

const findOne = async (req, res) => {
  if (req.body) {
    try {
      const data = await models.User.findOne({ where: { id: req.body.id } });
      res.json({ result: true, data });
    } catch (e) {
      res.json({ result: false, message: "올바르지 않은 요청입니다" });
    }
  } else {
    res.json({ result: false, message: "올바르지 않은 요청입니다" });
  }
};

const userInfo = async (req, res) => {
  if (req.body) {
    try {
      joinData = req.body.userInfo;
      res.json({ result: true });
    } catch (e) {
      res.json({ result: false, error: e });
    }
  } else {
    res.json({ result: false });
  }
};

const userGet = async (req, res) => {
  res.json(joinData);
  joinData = null;
};

const getToken = async (req, res) => {
  const token = jwtToken(req.body.email);
  res.cookie("token", token, { maxAge: 1000 * 60 * 60 });
  res.json({ result: true });
};

const checkNaver = (req, res) => {
  res.render("check");
};

const checkToken = async (req, res) => {
  if (req.body) {
    try {
      const access_token = req.body.accessToken;
      const response = await axios.get(`https://openapi.naver.com/v1/nid/me`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      console.log(response);
    } catch (e) {
      console.error(e);
    }
  }
};

module.exports = {
  main,
  getData,
  checkId,
  checkLogin,
  join,
  cookieCheck,
  logout,
  write,
  info,
  like,
  getCategory,
  getContent,
  getOneId,
  findPw,
  findId,
  changePw,
  detail,
  findOne,
  userInfo,
  userGet,
  getToken,
  checkNaver,
  checkToken,
};

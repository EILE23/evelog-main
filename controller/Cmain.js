require("dotenv").config();

const models = require("../models");
const bcrypt = require("bcryptjs");
const salt = 10;
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const marked = require("marked");
const axios = require("axios");
const crypto = require("crypto");
let des = false;

const nToken = null;
let joinData = null;

marked.setOptions({
  breaks: true, // 줄바꿈 유지
});

function emailHash(email) {
  return crypto.createHash("sha256").update(email).digest("hex");
}
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
        title: req.body.nickname + ".log",
        social: req.body.social ? req.body.social : "local",
        comment: "comment",
        vUrl: `${emailHash(req.body.userid)}`,
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
      res.json({
        result: true,
        message: "사용 가능한 아이디입니다.",
        des: des,
      });
    }
  } catch (e) {
    console.error(e);
  }
};

const checkLogin = async (req, res) => {
  try {
    const data = await models.User.findOne({
      where: { email: req.body.email },
    });

    if (!data) {
      return res.json({
        result: false,
        message: "등록되지 않은 아이디입니다.",
      });
    }

    const pwChc = bcryptCompare(req.body.password, data.password);

    if (pwChc) {
      const token = jwtToken(req.body.email);
      res.cookie("token", token, { maxAge: 1000 * 60 * 60 });
      return res.json({ result: true, message: "로그인 성공" });
    } else {
      return res.json({ result: false, message: "비밀번호가 틀립니다." });
    }
  } catch (e) {
    console.error(e);
    return res.json({
      result: false,
      message: "로그인 처리 중 오류가 발생했습니다.",
    });
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
      let src;
      if (user) {
        src = user.imgsrc;
      }
      if (check) {
        res.json({
          result: true,
          email: check.email,
          src: src,
          social: user.social,
          vUrl: user.vUrl,
          title: user.title,
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
    let content;
    console.log(req.query.ud);
    if (req.query.categoryid === "all") {
      if (req.query.ud === "up") {
        content = await models.Data.findAll({
          order: [["updatedAt", "DESC"]],
          limit: 50,
        });
      } else {
        content = await models.Data.findAll({
          order: [["updatedAt", "ASC"]],
          limit: 50,
        });
      }
    } else {
      if (req.query.ud === "up") {
        content = await models.Data.findAll({
          where: { categoryid: Number(req.query.categoryid) },
          order: [["updatedAt", "DESC"]],
          limit: 50,
        });
      } else {
        content = await models.Data.findAll({
          where: { categoryid: Number(req.query.categoryid) },
          order: [["updatedAt", "ASC"]],
          limit: 50,
        });
      }
    }

    const title = content.map((item) => item.title);
    const contentData = content.map((item) => item.comment);
    const img = content.map((item) => item.imgsrc);
    const id = content.map((item) => item.id);
    const date = content.map((item) => item.updatedAt);
    const nickname = await Promise.all(
      content.map(async (item) => {
        const data = await models.User.findOne({
          where: { email: item.email },
        });
        return { n: data.nickname, img: data.imgsrc };
      })
    );
    const total = contentData.map((item, i) => ({
      title: title[i],
      img: img[i],
      id: id[i],
      text: item,
      date: date[i],
      nickname: nickname[i],
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
        social: email.social,
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
  res.send("success");
};

const joinCheck = (req, res) => {
  res.render("joincheck");
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
  joinCheck,
  des,
};

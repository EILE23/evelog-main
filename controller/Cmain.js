require("dotenv").config();

const models = require("../models");
const bcrypt = require("bcryptjs");
const salt = 10;
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const bcryptPass = (pw) => {
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
      const address = req.body.RoadAddress + req.body.detailAddress;
      await models.User.create({
        email: req.body.userid,
        nickname: req.body.nickname,
        password: pw,
        username: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        phone: req.body.phone,
        address: address,
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
      res.json({ result: false, message: "아이디가 틀립니다." });
    }
  } catch (e) {
    console.error(e);
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "로그아웃" });
};

const cookieCheck = async (req, res) => {
  if (req.cookies.token) {
    try {
      const check = jwt.verify(req.cookies.token, secret);
      if (check) {
        res.json({ result: true, email: check.email });
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
    const category = models.Category;
  } catch (e) {}
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
};

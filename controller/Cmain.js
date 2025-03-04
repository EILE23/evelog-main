const models = require("../models");
const bcrypt = require("bcrypt");
const salt = 10;
const jwt = require("jsonwebtoken");
const secret = "afweanwefankfjdzkjsdnfkzjdnflzs";

const bcryptPass = (pw) => {
  return bcrypt.hashSync(pw, salt);
};
const bcryptCompare = (pw, dbpw) => {
  return bcrypt.compareSync(pw, dbpw);
};

const main = (req, res) => {
  res.render("join");
};

const getData = async (req, res) => {
  console.log(req.body);
  try {
    if (req.body) {
      const pw = bcryptPass(req.body.password);
      const address = req.body.RoadAddress + req.body.detailAddress;
      await models.Data.create({
        userid: req.body.userid,
        nickname: req.body.nickname,
        password: pw,
        userName: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        phone: req.body.phone,
        address: address,
      });
    }
  } catch (e) {
    console.error(e);
  }
};
module.exports = { main, getData };

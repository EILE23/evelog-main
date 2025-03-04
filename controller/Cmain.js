const models = require("../models");
const bcrypt = require("bcrypt");
const salt = 10;
const jwt = require("jsonwebtoken");
const secret = "afweanwefankfjdzkjsdnfkzjdnflzs";

const main = (req, res) => {
  res.render("main");
};
module.exports = { main };

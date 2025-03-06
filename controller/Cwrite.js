require("dotenv").config();

const models = require("../models");
const bcrypt = require("bcryptjs");
const salt = 10;
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const getCategory = async (req, res) => {
  try {
    const categories = await models.Category.findAll({});

    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Error fetching categories" });
  }
};

const createData = async (req, res) => {
  try {
    const { title, content, categoryId, imgsrc, userid } = req.body;

    await models.Data.create({
      title: title,
      content: content,
      categoryId: categoryId,
      imgsrc: imgsrc,
      userid: userid,
    });

    res.json({ result: true, message: "Data created successfully" }); // Send the created data
  } catch (error) {
    console.error("Error creating data:", error);
    res.status(500).json({ result: false, error: "Error creating data" });
  }
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

module.exports = {
  getCategory,
  createData,
  cookieCheck,
};

require("dotenv").config();

const models = require("../models");
const bcrypt = require("bcryptjs");
const salt = 10;
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const { Op } = require("sequelize");
const searchPage = async (req, res) => {
  res.render("search");
};

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
    console.log(req.body);
    const { title, content, categoryId, imgsrc, email, comment } = req.body;

    await models.Data.create({
      title: title,
      content: content,
      categoryId: categoryId,
      imgsrc: imgsrc,
      email: email,
      comment: comment,
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

const exportContentByUser = async (req, res) => {
  try {
    const userId = req.query.userId; // Get userId from query parameters

    if (!userId) {
      return res.status(400).json({ error: "userId is required" }); // Validate userId
    }

    const data = await models.Data.findAll({
      where: {
        email: userId, // Filter by userId
      },
    });

    res.json({ data: data });
  } catch (error) {
    console.error("Error exporting data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getLikePost = async (req, res) => {
  let post = await models.Like.findAll({ where: { userid: req.body.id } });
  let posts = post.map((item) => {
    return item.postid;
  });

  post = await models.Data.findAll({ where: { id: posts } });

  res.json(post);
};

const getRecentPost = async (req, res) => {
  let post = await models.Data.findAll({ where: { id: req.body.post } });

  res.json(post);
};

const getSearchPost = async (req, res) => {
  try {
    let text = req.body.text;

    let post = await models.Data.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${text}%` } },
          { comment: { [Op.like]: `%${text}%` } },
          { content: { [Op.like]: `%${text}%` } },
        ],
      },
    });
    if (post.length > 0) {
      res.json({ result: true, post: post });
    } else {
      res.json({ result: false, message: "검색 결과가 없습니다." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "서버 오류 발생" });
  }
};

module.exports = {
  getCategory,
  createData,
  cookieCheck,
  exportContentByUser,
  getLikePost,
  getRecentPost,
  searchPage,
  getSearchPost,
};

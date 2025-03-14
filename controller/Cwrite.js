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
      } else {
        res.json({ result: false, message: "검증되지 않은 유저." });
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    res.json({ result: false, message: "비 로그인 사용자." });
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
  try {
    // 사용자가 좋아요를 누른 게시물 ID 가져오기
    let post = await models.Like.findAll({
      where: { userid: req.body.id },
      attributes: ["postid"], // postid만 가져옴
    });

    // post에서 postid로만 이루어진 배열 생성
    let posts = post.map((item) => item.postid);

    // post에 다시 게시물의 postid로 이루어진 데이터 가져오기
    // User 테이블과 조인, 닉네임과 imgsrc를 포함해서
    post = await models.Data.findAll({
      where: { id: posts },
    });

    let postUser = post.map((item) => item.email);
    postUser = await models.User.findAll({ where: { email: postUser } });

    const likeUser = postUser.reduce((i, item) => {
      i[item.email] = item;
      return i;
    }, {});

    const total = post.map((item) => {
      const user = likeUser[item.email]; // post의 email을 기준으로 user 찾기
      if (user) {
        return {
          ...item.toJSON(), // Data 객체의 데이터를 복사
          nickname: user.nickname,
          imgsrc: user.imgsrc,
        };
      }
    });

    res.json(total);
  } catch (e) {
    console.error(e);
  }
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

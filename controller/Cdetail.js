const models = require("../models");
const marked = require("marked");

const getPostDetail = async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await models.Data.findOne({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const user = await models.User.findOne({
      where: { email: post.email },
    });

    if (!user) {
      console.error(`User not found for email: ${post.email}`);
      return res.status(404).json({ error: "User not found" });
    }

    const htmlContent = marked.parse(post.content);

    res.json({
      post: {
        id: post.id,
        imgsrc: post.imgsrc,
        title: post.title,
        content: htmlContent,
        createdAt: post.createdAt,
      },
      user: {
        vUrl: user.vUrl,
        nickname: user.nickname,
        title: user.title,
      },
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getVelog = (req, res) => {
  res.render("evelog", { email: req.params.email });
};

const postGet = async (req, res) => {
  if (req.query) {
    try {
      const post = await models.User.findOne({
        where: { vUrl: req.query.hsh },
      });
      res.json({ result: true, post: post, message: "데이터 전송 완료" });
    } catch (e) {
      console.error(e);
      res.json({ result: false, message: e });
    }
  } else {
    res.json({ result: false, message: "올바른 경로가 아닙니다." });
  }
};

module.exports = { getPostDetail, getVelog, postGet };

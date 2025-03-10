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
        nickname: user.nickname,
        title: user.title,
      },
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getPostDetail };

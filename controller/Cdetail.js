const models = require("../models");
const marked = require("marked");
const { Sequelize } = require("../models");
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
        commentCnt: post.commentCnt,
        likecnt: post.likecnt,
        content: htmlContent,
        createdAt: post.createdAt,
      },
      user: {
        id: user.id,
        vUrl: user.vUrl,
        nickname: user.nickname,
        title: user.title,
        imgsrc: user.imgsrc,
        comment: user.comment,
      },
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getVelog = (req, res) => {
  res.render("evelog", { vUrl: req.query.hsh });
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

const getLike = async (req, res) => {
  if (req.body) {
    try {
      const data = await models.Like.create({
        userid: req.body.userid,
        postid: req.body.postid,
      });
      if (data) {
        const post = await models.Data.update(
          {
            likecnt: Sequelize.literal(`
          CASE 
            WHEN likecnt IS NULL THEN 1 
            ELSE likecnt + 1 
          END
        `),
          },
          { where: { id: Number(req.body.postid) } }
        );
        const uppost = await models.Data.findOne({
          where: { id: req.body.postid },
        });
        res.json({ result: true, post: uppost });
      } else {
        res.json({ result: false, message: "허용되지 않은 요청입니다." });
      }
    } catch (e) {
      console.error(e);
      res.json({ result: false, message: "id 확인 필요" });
    }
  } else {
    res.json({ result: false, message: "허용되지 않은 요청입니다." });
  }
};

const dontLike = async (req, res) => {
  if (req.body) {
    try {
      console.log(req.body);
      await models.Like.destroy({
        where: { userid: req.body.userid, postid: req.body.postid },
      });

      const post = await models.Data.findOne({
        where: { id: req.body.postid },
        attributes: ["likecnt"],
      });

      if (post) {
        const cnt = post.likecnt - 1;
        const likecnt = cnt < 0 ? 0 : cnt;

        await models.Data.update(
          { likecnt: likecnt },
          { where: { id: req.body.postid } }
        );
        const uppost = await models.Data.findOne({
          where: { id: req.body.postid },
        });
        res.json({ result: true, post: uppost });
      }
    } catch (e) {
      console.error(e);
      res.json({ result: false, message: "id 확인 필요" });
    }
  } else {
    res.json({ result: false, message: "허용되지 않은 요청입니다." });
  }
};

const likeCheck = async (req, res) => {
  try {
    const data = await models.Like.findOne({
      where: { userid: req.body.userid, postid: req.body.postid },
    });
    if (data) {
      res.json({ result: true });
    } else {
      res.json({ result: false });
    }
  } catch (e) {
    console.error(e);
    res.json({ result: false });
  }
};

const pushComment = async (req, res) => {
  try {
    const data = await models.Comments.create({
      userid: req.body.userid,
      postid: req.body.postid,
      content: req.body.content,
      nickname: req.body.nickname,
      parentid: req.body.parentid,
    });

    if (req.body.parentid) {
      await models.Comments.update(
        {
          replyCnt: Sequelize.literal(`
          CASE 
            WHEN replyCnt IS NULL THEN 1 
            ELSE replyCnt + 1 
          END
        `),
        },
        { where: { id: Number(req.body.parentid) } }
      );
    } else {
      await models.Data.update(
        {
          commentCnt: Sequelize.literal(`
        CASE 
          WHEN commentCnt IS NULL THEN 1 
          ELSE commentCnt + 1 
        END
      `),
        },
        { where: { id: Number(req.body.postid) } }
      );
    }

    res.json({ result: true, comments: data });
  } catch (e) {
    console.error(e);
  }
};

const getComment = async (req, res) => {
  try {
    const data = await models.Comments.findAll({
      where: { postid: Number(req.body.postid) },
      include: [
        {
          model: models.User, // User 테이블 조인
          attributes: ["id", "nickname", "vUrl", "imgsrc"], // 필요한 필드만 가져오기
        },
      ],
    });

    res.json({ comments: data });
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  getPostDetail,
  getVelog,
  postGet,
  getLike,
  dontLike,
  likeCheck,
  pushComment,
  getComment,
};

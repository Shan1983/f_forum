const Like = require("../queries/like");
const User = require("../queries/users");

// exports.getLikeMeta = async (req, res, next) => {
//   try {
//   } catch (error) {
//     res.status(400);
//     next();
//   }
// };
exports.likeTopic = async (req, res, next) => {
  try {
    const like = await Like.likeATopic(req.params.topic, req.session.userId);

    if (like.rows <= 0) {
      res.status(400);
      return next({
        error: "LIKEERROR",
        message: "Whoops, something went wrong, try liking that topic again"
      });
    }

    await User.addToPoints(req.session.userId, 10);

    res.json({ success: true });
  } catch (error) {
    res.status(400);
    next();
  }
};
exports.likeReply = async (req, res, next) => {
  try {
    const like = await Like.likeAReply(req.params.reply, req.session.userId);

    if (like.rows <= 0) {
      res.status(400);
      return next({
        error: "LIKEERROR",
        message: "Whoops, something went wrong, try liking that reply again"
      });
    }

    await User.addToPoints(req.session.userId, 10);

    res.json({ success: true });
  } catch (error) {
    res.status(400);
    next();
  }
};
exports.removeLike = async (req, res, next) => {
  try {
    await Like.removeLike(req.params.id);

    res.json({ success: true });
  } catch (error) {
    res.status(400);
    next();
  }
};

const Joi = require("joi");
const Friend = require("../queries/friends");
const User = require("../queries/users");

const { friendSchema } = require("../helpers/validation");

exports.getFriends = async (req, res, next) => {
  try {
    const friends = await Friend.findById(req.params.user);

    if (friends.rows.length <= 0) {
      res.status(400);
      return next({
        error: "FRIENDERROR",
        message: "No friends found."
      });
    }

    const friendObj = friends.rows.map(f => {
      return {
        sender: f.sender,
        reciever: f.reciever,
        created: f.created_at
      };
    });

    res.json(friendObj);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.addFriend = async (req, res, next) => {
  try {
    // find friend request
    const friendReq = await Friend.pendingFriendship(req.params.sender);

    if (friendReq.rows.length <= 0) {
      res.status(404);
      return next();
    }

    // save/accept friendship
    await Friend.acceptNewFriend(friendReq.rows[0].reciever_id);

    res.json({ success: true });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.sendFriendRequest = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.reciever);

    if (user === undefined) {
      res.status(404);
      next();
    }

    // check if friendship isnt already pending
    const check = await Friend.checkPendingRequests(
      req.session.userId,
      user.id
    );

    if (check.rows.length > 0) {
      res.status(400);
      return next({
        error: "PENDINGFRIENDREQUEST",
        message: "Your friend request is currently pending.."
      });
    }

    const friendObj = {
      reciever: user.username,
      reciever_id: user.id,
      sender: req.session.username,
      sender_id: req.session.userId
    };
    await Friend.sendFriendRequest(friendObj);

    res.json({ success: true });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.removeFriend = async (req, res, next) => {
  try {
    await Friend.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const Penalty = require("../queries/penalty");
const User = require("../queries/users");

exports.getAll = async (req, res, next) => {
  try {
    const naughtyUsers = await Penalty.findAll();

    if (naughtyUsers.rows.length <= 0) {
      res.status(404);
      return next();
    }

    const naughtyObj = naughtyUsers.raw.map(async n => {
      const user = await User.findById(n.id);
      return {
        user: user.username,
        email: user.email,
        reason: n.reason,
        release: n.release_date
      };
    });

    res.json(naughtyObj);
  } catch (error) {
    res.status(400);
    next(error);
  }
};
exports.putInTheBox = async (req, res, next) => {
  try {
    const user = await Penalty.findById(req.params.id);

    if (user.rows.length <= 0) {
      res.status(404);
      return next();
    }

    userObj = {
      user_id: user.id,
      reason: req.body.reason,
      release_date: moment(user.release_date).add(req.body.time, "days")
    };
    await Penalty.insert(userObj);

    res.json({ success: true });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
exports.editUserPenalty = async (req, res, next) => {
  try {
    const user = await Penalty.findById(req.params.id);
    if (naughtyUsers.rows.length <= 0) {
      res.status(404);
      return next();
    }
    user.release_date = moment(user.release_date).add(req.body.time, "days");
    await Penalty.update(user.id, user);

    res.json({ success: true });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
exports.removeUserPenalty = async (req, res, next) => {
  try {
    await Penalty.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

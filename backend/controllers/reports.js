const Report = require("../queries/reports");
const moment = require("moment");

exports.getAllReports = async (req, res, next) => {
  try {
    const reports = await Report.findAllReports();

    if (reports.rows.length <= 0) {
      res.status(404);
      next();
    }

    const reportObj = reports.rows.map(async r => {
      const report = await Report.getTopic(r.topic_reply_id);
      return {
        user: r.user_id,
        topic_title: report.title,
        reply_no: report.id,
        comment: r.comment,
        reason: r.reason,
        created: moment(r.created_at).fromNow(),
        path: `/api/v1/topic/${report.id}`
      };
    });

    res.json(reportObj);
  } catch (error) {
    res.status(400);
    next(error);
  }
};
exports.createReport = async (req, res, next) => {
  try {
    const { topic_reply, comment, reason } = req.body;

    const acceptableReponses = [
      "Spam",
      "Inappropriate",
      "Harrassment",
      "Requested",
      "Duplicate"
    ];

    if (!reason in acceptableReponses) {
      res.status(400);
      return next({
        error: "VALIDATIONERROR",
        message: "Only the available options will be accepted."
      });
    }

    const reportObj = {
      topic_reply_id: topic_reply,
      comment,
      reason,
      user_id: user
    };

    await Report.insert(reportObj);

    // emit report event

    res.json({ success: true });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
exports.removeReport = async (req, res, next) => {
  try {
    await Report.delete(req.params.id);

    res.json({ success: true });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

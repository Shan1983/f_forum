const Joi = require("joi");
const db = require("../db");

exports.insertAndValidate = async (table, item, schema) => {
  const result = Joi.validate(item, schema);

  if ((await result.error) === null) {
    const rows = await db(table).insert(item, "*");
    return rows[0];
  } else {
    return Promise.reject(result.error);
  }
};

exports.softDelete = async (table, id) => {
  return db(table)
    .where("id", id)
    .update({
      deleted: true,
      deleted_at: new Date()
    });
};

exports.paginator = async paginator => {
  const pageCount = Math.ceil(paginator.count / paginator.limit);

  let currentPage = paginator.page;

  let items = [];
  let splices = [];
  let data = [];

  paginator.query.map(q => {
    items.push(q);
  });

  while (items.length > 0) {
    splices.push(items.splice(0, paginator.limit));
  }

  if (paginator.req.query.page !== "undefined") {
    currentPage = +paginator.req.query.page;
  }

  data = splices[+currentPage - 1];

  // console.log({
  //   data,
  //   limit: paginator.limit,
  //   count: paginator.count,
  //   pageCount: Math.ceil(pageCount),
  //   currentPage
  // });

  return {
    data,
    limit: paginator.limit,
    count: paginator.count,
    pageCount: Math.floor(pageCount),
    currentPage
  };
};

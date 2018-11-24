const Joi = require("joi");
// const db = require("../db");

const { insertAndValidate } = require("./index");

const schema = Joi.object().keys({
  id: Joi.string().required(),
  user_id: Joi.string(),
  ip: Joi.string()
    .ip({
      version: ["ipv4", "ipv6"],
      cidr: "optional"
    })
    .required()
});

module.exports = {
  //   async findAllIP() {
  //     const query = await db("ips");
  //     return query;
  //   },

  insert(ip) {
    return insertAndValidate("ips", ip, schema);
  }
};

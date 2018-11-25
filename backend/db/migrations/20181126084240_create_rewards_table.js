exports.up = function(knex, Promise) {
  return knex.schema.createTable("rewards", t => {
    t.increments("id").primary();
    t.integer("reply");
    t.integer("topic");
    t.integer("like");
    t.integer("create_poll");
    t.integer("answer_poll");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("rewards");
};

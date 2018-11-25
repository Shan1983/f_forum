exports.up = function(knex, Promise) {
  return knex.schema.createTable("likes", t => {
    t.increments("id").primary();
    t.integer("user_id");
    t.integer("topic_id");
    t.integer("reply_id");
    t.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("likes");
};

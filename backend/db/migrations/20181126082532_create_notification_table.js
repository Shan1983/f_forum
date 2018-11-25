exports.up = function(knex, Promise) {
  return knex.schema.createTable("notifications", t => {
    t.increments("id").primary();
    t.enu("type", ["Friend", "Post", "Private", "Like", "Other"]);
    t.integer("sender_id");
    t.integer("reciever_id");
    t.string("topic");
    t.timestamps(true, true);
    t.boolean("deleted");
    t.timestamp("deleted_at");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("notifications");
};

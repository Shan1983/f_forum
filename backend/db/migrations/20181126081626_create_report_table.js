exports.up = function(knex, Promise) {
  return knex.schema.createTable("reports", t => {
    t.increments("id").primary();
    t.integer("user_id");
    t.integer("topic_reply_id");
    t.string("comment");
    t.enu("reason", [
      "Spam",
      "Inappropriate",
      "Harrassment",
      "Requested",
      "Duplicate"
    ]);
    t.timestamps(true, true);
    t.boolean("deleted").defaultTo(false);
    t.timestamp("deleted_at");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("reports");
};

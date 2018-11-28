exports.up = function(knex, Promise) {
  return knex.schema.createTable("poll_questions", t => {
    t.increments("id").primary();
    t.integer("topic_id").notNullable();
    t.string("question");
    t.integer("user_id");
    t.boolean("active");
    t.timestamp("duration");
    t.timestamps(true, true);
    t.boolean("deleted");
    t.timestamp("deleted_at");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("poll_questions");
};

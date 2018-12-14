exports.up = function(knex, Promise) {
  return knex.schema.createTable("poll_answers", t => {
    t.increments("ans_id").primary();
    t.string("response");
    t.integer("poll_question_id");
    t.timestamps(true, true);
    t.boolean("deleted");
    t.timestamp("deleted_at");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("poll_answers");
};

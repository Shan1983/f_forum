exports.up = function(knex, Promise) {
  return knex.schema.createTable("poll_votes", t => {
    t.increments("id").primary();
    t.integer("user_id");
    t.integer("poll_question_id");
    t.integer("poll_response_id");
    t.timestamps(true, true);
    t.boolean("deleted");
    t.timestamp("deleted_at");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("poll_votes");
};

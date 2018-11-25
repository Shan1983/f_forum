exports.up = function(knex, Promise) {
  return knex.schema.createTable("penaltyBoxes", t => {
    t.increments("id").primary();
    t.integer("user_id").index();
    t.integer("duration");
    t.timestamp("release_date");
    t.timestamps(true, true);
    t.boolean("deleted");
    t.timestamp("deleted_at");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("penaltyBoxes");
};

exports.up = function(knex, Promise) {
  return knex.schema.createTable("friends", t => {
    t.increments("id").primary();
    t.integer("pending_request");
    t.integer("user_id").index();
    t.integer("accepting_friend");
    t.timestamps(true, true);
    t.boolean("deleted").defaultTo(false);
    t.timestamp("deleted_at");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("friends");
};

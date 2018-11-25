exports.up = function(knex, Promise) {
  return knex.schema.createTable("subscriptions", t => {
    t.increments("id").primary();
    t.integer("topic_id");
    t.integer("user_id");
    t.timestamps(true, true);
    t.boolean("mute").defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("subscriptions");
};

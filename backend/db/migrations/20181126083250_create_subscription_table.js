exports.up = function(knex, Promise) {
  return knex.schema.createTable("subscriptions", t => {
    t.increments("id").primary();
    t.integer("topic_id");
    t.integer("user_id");
    t.boolean("mute").defaultTo(false);
    t.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("subscriptions");
};

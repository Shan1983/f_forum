exports.up = function(knex, Promise) {
  return knex.schema.createTable("topic_replies", t => {
    t.increments("id").primary();
    t.integer("topic_id").notNullable();
    t.integer("user_id").notNullable();
    t.text("reply").notNullable();
    t.timestamps(true, true);
    t.boolean("deleted")
      .defaultTo(false)
      .notNullable();
    t.timestamp("deleted_at");

    t.foreign("topic_id").references("topics.id");
    t.foreign("user_id").references("users.id");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("topic_replies");
};

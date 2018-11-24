exports.up = function(knex, Promise) {
  return knex.schema.createTable("direct_messages", t => {
    t.increments("id").primary();
    t.integer("sender_id").notNullable();
    t.integer("reciever_id").notNullable();
    t.text("message").notNullable();
    t.timestamps(true, true);
    t.boolean("deleted")
      .defaultTo(false)
      .notNullable();
    t.timestamp("deleted_at");

    t.foreign("sender_id").references("users.id");
    t.foreign("reciever_id").references("users.id");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("direct_messages");
};

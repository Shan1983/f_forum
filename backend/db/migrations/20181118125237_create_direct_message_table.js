exports.up = function(knex, Promise) {
  return knex.schema.createTable("direct_messages", t => {
    t.uuid("id").primary();
    t.uuid("sender_id").notNullable();
    t.uuid("reciever_id").notNullable();
    t.text("message").notNullable();
    t.timestamps(true, true);

    t.foreign("sender_id").references("users.id");
    t.foreign("reciever_id").references("users.id");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("direct_messages");
};

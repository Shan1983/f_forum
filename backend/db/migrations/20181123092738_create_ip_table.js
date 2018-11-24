exports.up = function(knex, Promise) {
  return knex.schema.createTable("ips", t => {
    t.increments("id").primary();
    t.integer("user_id").index();
    t.string("ip").notNullable();
    t.timestamps(true, true);
    t.boolean("deleted")
      .defaultTo(false)
      .notNullable();
    t.timestamp("deleted_at");

    t.foreign("user_id").references("users.id");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("ips");
};

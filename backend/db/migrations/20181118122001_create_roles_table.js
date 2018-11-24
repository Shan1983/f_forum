exports.up = function(knex, Promise) {
  return knex.schema.createTable("roles", t => {
    t.increments("id").primary();
    t.string("title").notNullable();
    t.timestamps(true, true);
    t.boolean("deleted")
      .defaultTo(false)
      .notNullable();
    t.timestamp("deleted_at");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("roles");
};

exports.up = function(knex, Promise) {
  return knex.schema.createTable("roles", t => {
    t.uuid("id").primary();
    t.string("title").notNullable();
    t.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("roles");
};

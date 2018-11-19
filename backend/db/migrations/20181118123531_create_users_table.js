exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", t => {
    t.uuid("id").primary();
    t.string("color_icon").defaultTo("#000");
    t.string("username").notNullable();
    t.string("email")
      .unique()
      .notNullable();
    t.string("hash").notNullable();
    t.boolean("banned").defaultTo(false);
    t.uuid("role_id");
    t.string("avatar");
    t.string("token");
    t.boolean("verified").defaultTo(false);
    t.timestamps(true, true);
    t.boolean("deleted")
      .defaultTo(false)
      .notNullable();
    t.timestamp("deleted_at");

    t.foreign("role_id").references("roles.id");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("users");
};

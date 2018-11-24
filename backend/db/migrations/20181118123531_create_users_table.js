exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", t => {
    t.increments("id").primary();
    t.string("color_icon").defaultTo("#000");
    t.string("username").notNullable();
    t.string("email")
      .unique()
      .notNullable();
    t.string("hash").notNullable();
    t.integer("post_count")
      .unsigned()
      .defaultTo(0);
    t.integer("points")
      .unsigned()
      .defaultTo(0);
    t.json("friends_id");
    t.boolean("banned").defaultTo(false);
    t.integer("role_id").defaultTo(1);
    t.string("avatar");
    t.string("token");
    t.boolean("verified").defaultTo(false);
    t.string("ptoken");
    t.text("bio");
    t.boolean("allowSubs").defaultTo(true);
    t.boolean("advertising").defaultTo(false);
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

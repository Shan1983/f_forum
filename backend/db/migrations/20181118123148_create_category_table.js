exports.up = function(knex, Promise) {
  return knex.schema.createTable("categories", t => {
    t.uuid("id").primary();
    t.string("title").notNullable();
    t.string("slug").notNullable();
    t.text("description");
    t.string("icon_color").defaultTo("#000");
    t.timestamps(true, true);
    t.boolean("deleted")
      .defaultTo(false)
      .notNullable();
    t.timestamp("deleted_at");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("categories");
};

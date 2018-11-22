exports.up = function(knex, Promise) {
  return knex.schema.createTable("topics", t => {
    t.uuid("id").primary();
    t.string("topic_color").defaultTo("#d2d2d2");
    t.uuid("category_id")
      .notNullable()
      .index();
    t.string("title").notNullable();
    t.string("slug").notNullable();
    t.uuid("user_id")
      .notNullable()
      .index();
    t.text("discussion").notNullable();
    t.boolean("sticky").defaultTo(false);
    t.enu("lock", ["open", "closed"]).defaultTo("open");
    t.string("lock_reason");
    t.timestamps(true, true);
    t.boolean("deleted")
      .defaultTo(false)
      .notNullable();
    t.timestamp("deleted_at");

    t.foreign("category_id").references("categories.id");
    t.foreign("user_id").references("users.id");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("topics");
};

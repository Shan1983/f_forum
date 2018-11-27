exports.up = function(knex, Promise) {
  return knex.schema.createTable("topics", t => {
    t.increments("id").primary();
    t.string("topic_color").defaultTo("#d2d2d2");
    t.integer("category_id").notNullable();

    t.string("title").notNullable();
    t.string("slug").notNullable();
    t.integer("user_id").notNullable();

    t.text("discussion").notNullable();
    t.boolean("sticky").defaultTo(false);
    t.timestamp("sticky_ends");
    t.enu("stick_duration", ["3", "7", "30", "forever"]);
    t.enu("lock", ["open", "closed"]).defaultTo("open");
    t.string("lock_reason");
    t.timestamps(true, true);
    t.boolean("deleted")
      .defaultTo(false)
      .notNullable();
    t.timestamp("deleted_at");

    // t.foreign("category_id").references("categories.id");
    // t.foreign("user_id").references("users.id");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("topics");
};

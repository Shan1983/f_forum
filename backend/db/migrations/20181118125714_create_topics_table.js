exports.up = function(knex, Promise) {
  return knex.schema.createTable("topics", t => {
    t.uuid("id").primary();
    t.uuid("category_id").notNullable();
    t.string("title").notNullable();
    t.string("slug").notNullable();
    t.uuid("user_id").notNullable();
    t.text("discussion").notNullable();
    t.timestamps(true, true);

    t.foreign("category_id").references("categories.id");
    t.foreign("user_id").references("users.id");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("topics");
};

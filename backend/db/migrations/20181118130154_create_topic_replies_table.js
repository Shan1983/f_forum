exports.up = function(knex, Promise) {
  return knex.schema.createTable("topic_replies", t => {
    t.uuid("id").primary();
    t.uuid("topic_id").notNullable();
    t.uuid("user_id").notNullable();
    t.text("reply").notNullable();
    t.timestamps(true, true);

    t.foreign("topic_id").references("topics.id");
    t.foreign("user_id").references("users.id");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("topic_replies");
};

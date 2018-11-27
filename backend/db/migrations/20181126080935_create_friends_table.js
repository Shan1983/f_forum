exports.up = function(knex, Promise) {
  return knex.schema.createTable("friends", t => {
    t.increments("id").primary();
    t.string("reciever");
    t.integer("reciever_id");
    t.string("sender").index();
    t.integer("sender_id").index();
    t.boolean("pending").defaultTo(false);
    t.boolean("accepted").defaultTo(false);
    t.timestamps(true, true);
    t.boolean("deleted").defaultTo(false);
    t.timestamp("deleted_at");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("friends");
};

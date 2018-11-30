exports.setupTestDb = async db => {
  await db.migrate.rollback();
  await db.migrate.latest();
  await db.seed.run();
};

exports.DbCleanup = async db => {
  await db.migrate.rollback();
};

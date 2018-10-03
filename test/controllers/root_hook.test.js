const helper = require("./../helpers");

before(async () => {
  await helper.sync_db();
});

beforeEach(async () => {
  await helper.truncate_db();
});

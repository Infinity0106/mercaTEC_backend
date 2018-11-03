const helper = require("./../helpers");

before(async () => {
  return await helper.sync_db();
});

beforeEach(async () => {
  return await helper.truncate_db();
});

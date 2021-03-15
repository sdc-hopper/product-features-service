const nano = require('nano')('http://admin:password@localhost:5984');
const { fakeDataGenerator } = require('./fakeDataGenerator.js');

let seed = async (totalRecordCount) => {
  const db = nano.db.use('testing');
  batchCount = Math.floor(totalRecordCount / 5 + 1)
  for (let chunk = 0; chunk < 5; chunk++) {

    (async () => {
      for (let batch = 0; batch < batchCount; batch++) {
        let idIncrement = batch * chunk * 100;
        let data = await fakeDataGenerator(100, 1000 + idIncrement);
        await db.bulk({ docs: data })
      }
      console.log('finished with chunk: ', chunk)
    })();
  }
};

let seeder = async () => {
  let dbName = 'testing';
  let dblist = await nano.db.list();

  if (dblist.includes(dbName)) {
    await nano.db.destroy(dbName);
  }
  await nano.db.create(dbName);

  seed(10000);
}

seeder();
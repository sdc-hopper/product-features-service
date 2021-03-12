const nano = require('nano')('http://admin:password@localhost:5984');
const { fakeDataGenerator } = require('./fakeDataGenerator.js');

nano.db.destroy('testing').then(() => {
  nano.db.create('testing').then(() => {
    const db = nano.db.use('testing');
    (async () => {
      for (let id = 0; id < 10000; id += 1000) {
        await add(id, db);
      }
    })();
  });
});

let add = async (id, db) => {
  let fakeData = await fakeDataGenerator(1000, 1000 + id);
  await db.bulk({docs: fakeData});
  console.log('Done with: ', id)
}
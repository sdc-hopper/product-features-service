const { Pool } = require('pg');
const db = require('./seed-data/postgres.js');

const client = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5432,
});

client.connect()
.then(() => console.log('Client successfully connected'))
.catch(err => console.log('Client error: ', err));

const seed = async (recordcount) => {
  db.startup(client)
  .then(() => {
    db.seed(client, recordcount)
    .then(() => console.log('Successfully seeded'))
  })
  .catch(err => console.log('Seeder error: ', err));
}

const load = async (productid) => {
  let records = await db.load(client, productid);
  return build(records.rows);
}

const build = (record) => {
  let result = {
    banner: { text: [] },
    features: [],
    featureSetup: { description: [] },
    additionalFeatures: { contentGrid: [] }
  };
  for (row of record) {
    if (row.type === 'banner') {
      result.banner.header = result.banner.header ? result.banner.header : row.header;
      result.banner.text.push(row.description);
    }
    else if (row.type === 'feature') {
      let feature = { header: row.header, description: row.description };
      result.features.push(feature);
    }
    else if (row.type === 'setup') {
      result.featureSetup.header = result.featureSetup.header ? result.featureSetup.header : row.header;
      result.featureSetup.description.push(row.description);
    }
    else if (row.type === 'additional') {
      result.additionalFeatures.header = row.header;
      result.additionalFeatures.description = row.description;
    }
    else if (row.type === 'addfeature') {
      let feature = { title: row.header, description: row.description }
      result.additionalFeatures.contentGrid.push(feature);
    }
  }
  return result;
}

module.exports.load = load;

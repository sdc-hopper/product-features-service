const { Pool } = require('pg');
// const { fakeDataGenerator } = require('./fakeDataGenerator.js');
const { generator } = require('./csvGenerator');
const { csvreader, slowreader } = require('./streamreader')

let recordid = 10000000;
let featureid = 0;

const client = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5432,
});

client.connect()
.then(log => console.log('successfully connected'))
.catch(err => console.log('error: ', err));

const initializer = async () => {
  const makeRecords = `
  CREATE TABLE records (
      recordid integer,
      productid integer UNIQUE,
      PRIMARY KEY(recordid)
  );
  `;
  const makeFeatures = `
  CREATE TABLE features (
    productid integer REFERENCES records(productid) NOT NULL,
    featureid integer REFERENCES featurecontent(featureid) NOT NULL,
    PRIMARY KEY(productid, featureid)
  );
  `;
  const makeFeatureContent = `
  CREATE TABLE featurecontent (
    featureid integer UNIQUE,
    header varchar(127),
    description varchar(511),
    type varchar(31),
    PRIMARY KEY(featureid)
  );
  `;
  const clear = `
  DROP TABLE IF EXISTS features;
  DROP TABLE IF EXISTS featurecontent;
  DROP TABLE IF EXISTS records;
  `;

  await client.query(clear);
  console.log('cleared')
  await client.query(makeRecords);
  await client.query(makeFeatureContent);
  await client.query(makeFeatures);
  console.log('made tables')
}

const insertFeature = async (productid, header, description, type) => {
  featureid++;
  await client.query(`
    INSERT INTO featurecontent (featureid, header, description, type)
    VALUES (${featureid}, '${header}', '${description}', '${type}');
    INSERT INTO features (productid, featureid)
    VALUES (${productid}, ${featureid});
    `).catch(err => console.log(err));
}

const insertRecordObject = async (item) => {
  let productid = item.productId;
  let banner = item.banner;
  let features = item.features;
  let featureSetup = item.featureSetup
  let additionals = item.additionalFeatures;
  await client.query(`
  INSERT INTO records (recordid, productid)
  VALUES (${recordid}, ${productid});
  `);
  for (text of banner.text) {
    insertFeature(productid, banner.header, text, 'banner');
  }
  for (feature of features) {
    insertFeature(productid, feature.header, feature.description, 'feature');
  }
  for (desc of featureSetup.description) {
    insertFeature(productid, featureSetup.header, desc, 'setup');
  }
  insertFeature(productid, additionals.header, additionals.description, 'additional');
  for (feature of additionals.contentGrid) {
    insertFeature(productid, feature.title, feature.description, 'additionalfeature');
  }
}

let insert = async (data) => {
  let productid = parseInt(data[0]);

  await client.query(`
  INSERT INTO records (recordid, productid)
  VALUES (${recordid}, ${productid});
  `);

  // banner
  insertFeature(productid, data[1], data[2], 'banner');
  insertFeature(productid, data[1], data[3], 'banner');
  // features
  insertFeature(productid, data[4], data[5], 'feature');
  insertFeature(productid, data[6], data[7], 'feature');
  insertFeature(productid, data[8], data[9], 'feature');
  insertFeature(productid, data[10], data[11], 'feature');
  insertFeature(productid, data[12], data[13], 'feature');
  insertFeature(productid, data[14], data[15], 'feature');
  insertFeature(productid, data[16], data[17], 'feature');
  // setup
  insertFeature(productid, data[18], data[19], 'setup');
  insertFeature(productid, data[18], data[20], 'setup');
  insertFeature(productid, data[18], data[21], 'setup');
  // additonal
  insertFeature(productid, data[22], data[23], 'additional');
  // additonalfeatures
  insertFeature(productid, data[24], data[25], 'addfeature');
  insertFeature(productid, data[26], data[27], 'addfeature');
  insertFeature(productid, data[28], data[29], 'addfeature');
  insertFeature(productid, data[30], data[31], 'addfeature');
  insertFeature(productid, data[32], data[33], 'addfeature');

  recordid++;
}

let seeder = async (records) => {
  await initializer();
  let headers = records.shift();

  for (record of records) {
    try {
      await insert(record);
      if (recordid % 100 === 0) { console.log('Finished record: ', recordid) }
    }
    catch(err) { console.log(err) }
  }
  client.query(`SELECT * FROM records;`)
  .then(records => console.log('Got records: ', records.rows.length))
  .catch(err => console.log(err))

  getter(1005)
  .then(record => console.log('Got item: ', record.rows.length))
  .catch(err => console.log(err))
  .finally(() => client.end());
}

let getter = async (productid) => {
  let result = await client.query(`
  SELECT (featurecontent.featureid, header, description, type)
  FROM featurecontent
  WHERE featurecontent.featureid = ANY
  (SELECT (featureid) FROM features WHERE (productid = ${productid}))
  ;`)
  return result;
}

let testseed = async () => {
  let path = 'database/seed-data/csvData/data.csv';
  // let data = await csvreader(path);
  let data = await slowreader(path);
  console.log('Got ', data.length, ' records.')

  seeder(data);
}

testseed();

module.exports.seeder = seeder;
module.exports.getter = getter;

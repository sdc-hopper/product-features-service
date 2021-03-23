const { Client } = require('pg');
const { fakeDataGenerator } = require('./fakeDataGenerator.js');

let recordid = 10000000;
let featureid = 0;

const client = new Client({
  user: 'benjaminboyle',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5432,
});

client.connect()
.then(log => console.log('successfully connected: ', log))
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
  await client.query(`
    INSERT INTO featurecontent (featureid, header, description, type)
    VALUES (${featureid}, '${header}', '${description}', '${type}');
    INSERT INTO features (productid, featureid)
    VALUES (${productid}, ${featureid});
    `).catch(err => console.log(err));
  featureid++;
}

const insert = async (item) => {
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
    await insertFeature(productid, banner.header, text, 'banner');
  }

  for (feature of features) {
    await insertFeature(productid, feature.header, feature.description, 'feature');
  }

  for (desc of featureSetup.description) {
    await insertFeature(productid, featureSetup.header, desc, 'setup');
  }

  await insertFeature(productid, additionals.header, additionals.description, 'additional');
  for (feature of additionals.contentGrid) {
    await insertFeature(productid, feature.title, feature.description, 'additionalfeature');
  }

  recordid++;
}

let seeder = async (records) => {
  await initializer();
  for (record of records) {
    try {
      await insert(record, recordid++)
      if (recordid % 100 === 0) { console.log('Finished record: ', recordid) }
    }
    catch(err) { console.log(err) }
  }
  getter(1005)
  .then(record => console.log('Got : ', record.rows))
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

seeder(fakeDataGenerator(10, 1000));

module.exports.seeder = seeder;
module.exports.getter = getter;
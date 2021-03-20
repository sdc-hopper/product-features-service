const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5432,
});

client.connect()
.then(log => console.log('successfully connected: ', log))
.catch(err => console.log('error: ', err));

const makeRecords = `
CREATE TABLE records (
    recordid integer,
    productid integer UNIQUE,
    bannerid integer,
    bannertext varchar(50),
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
  featureheader varchar(50),
  featuredesc varchar(250),
  PRIMARY KEY(featureid)
);
`;

const clear = `
DROP TABLE IF EXISTS features;
DROP TABLE IF EXISTS featurecontent;
DROP TABLE IF EXISTS records;
`

const fakeRecord1 = `
INSERT INTO records (recordid, productid, bannerid, bannertext)
VALUES (25, 58, 114, 'some banner');
`;

const fakeRecord2 = `
INSERT INTO records (recordid, productid, bannerid, bannertext)
VALUES (99, 253, 775, 'some banner');
`;

const fakeFeature1 = `
INSERT INTO featurecontent (featureid, featureheader, featuredesc)
VALUES (1098, 'header', 'some description');
`;

const fakeFeature2 = `
INSERT INTO featurecontent (featureid, featureheader, featuredesc)
VALUES (1343, 'header', 'some description');
`;

const fakeFeatureConnect1 = `
INSERT INTO features (productid, featureid)
VALUES (58, 1098);
`

const fakeFeatureConnect2 = `
INSERT INTO features (productid, featureid)
VALUES (58, 1343);
`

const fakeRecords = (num) => {
  let records = []
  for (let i = 0; i < num; i++) {
    records.push({recordid: i, productid: i+100, bannerid: i+1000, bannertext: 'test'});
  }
  return records;
}

const seeall = `SELECT * FROM featurecontent LEFT OUTER JOIN features ON (productid = 58);`;

let seeder = async () => {
  let queries = [clear, makeRecords, makeFeatureContent, makeFeatures, fakeRecord1,
    fakeRecord2, fakeFeature1, fakeFeature2, fakeFeatureConnect1, fakeFeatureConnect2];
  for (query of queries) {
    await client.query(query);
  }
  client.query(seeall)
  .then(records => console.log(records.rows))
  .catch(err => console.log(err))
  .finally(() => client.end());
};

seeder();

const { Pool } = require('pg');

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

const startup = async () => {
  await client.query(`
    DROP TABLE IF EXISTS features;
  `);
  await client.query(`
    CREATE TABLE features (
    recordid integer PRIMARY KEY,
    productid integer,
    header varchar(127),
    description varchar(511),
    type varchar(31)
    );
    CREATE INDEX product_id ON features(productid);
    CREATE INDEX type ON features(type);
  `);
  console.log('Setup completed');
}

let adder = async (filecount) => {
  for (let i = 0; i < filecount; i++) {
    await client.query(`
      COPY features
      FROM '/Users/shared/sdcdata/data${i}.csv' WITH DELIMITER ',' CSV HEADER;
    `);
    console.log('At batch: ', i)
  }

  client.query(`SELECT * FROM features;`)
  .then(records => console.log('Got records: ', records.rows.length))
  .catch(err => console.log(err))
}

let seed = async (filecount) => {
  await startup();
  await adder(filecount);
  console.log('All done!');
  await bigtester();
}

let bigtester = async () => {
  console.log('POWERING UP')
  let data = await client.query(`EXPLAIN ANALYZE SELECT * FROM features WHERE productid = 2000000;`);
  let result = await client.query(`SELECT * FROM features WHERE productid = 2000000;`);
  console.log(data.rows);
  console.log(result.rows);
};

// Insert 2 million records from csv files
seed(80);
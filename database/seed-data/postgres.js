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
    DROP TABLE IF EXISTS featurecontent;
    DROP TABLE IF EXISTS records;
  `);
  await client.query(`
    CREATE TABLE features (
    productid integer,
    header varchar(127),
    description varchar(511),
    type varchar(31)
    );
  `);
  console.log('Setup completed');
}

let adder = async () => {
  let filecount = 40;
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

let seed = async () => {
  await startup();
  await adder();
  console.log('All done!');
}

seed();
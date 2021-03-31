const startup = async (client) => {
  try {
    await client.query(`DROP TABLE IF EXISTS features;`);
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
    console.log('Successfully started up database');
  }
  catch (err) {
    console.log('Database failed to start: ', err);
  }
}

let seed = async (client, filecount) => {
  for (let i = 0; i < filecount; i++) {
    await client.query(`
      COPY features
      FROM '/Users/shared/sdcdata/data${i}.csv' WITH DELIMITER ',' CSV HEADER;
    `);
    console.log('At batch: ', i)
  }

  client.query(`SELECT * FROM features;`)
  .then(records => console.log('New record count: ', records.rows.length))
  .catch(err => console.log(err))
}

let load = async (client, productid) => {
  return await client.query(`SELECT * FROM features WHERE productid = ${productid};`);
}

let analyze = async(client, productid) => {
  return await client.query(`EXPLAIN ANALYZE SELECT * FROM features WHERE productid = ${productid};`);
}

module.exports.load = load;
module.exports.analyze = analyze;
module.exports.seed = seed;
module.exports.startup = startup;

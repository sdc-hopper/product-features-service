const { seed } = require('./postgresdb.js');
const recordcount = 1000000;

(() => seed(recordcount))()
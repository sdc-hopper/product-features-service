const fs = require('fs');
const util = require('util');

let datapath = 'database/seed-data/csvData/data.csv';

let disassembler = files => {
  let result = {};
  let data = files.split('\n');
  let headers = data.shift().split(',');
  result.headers = headers;
  for (let i = 0; i < data.length-1; i++) {
    let record = data[i];
    record = record.split(',');
    record = record.slice(1, record.length-1);
    result[i] = record;
  }
  return result;
}

let reader = async (file) => {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(file, {encoding: 'utf8'});
    stream.on('error', reject);
    stream.on('data', data => resolve(disassembler(data)));
  });
}

let readData = async (filepath) => await reader(filepath);

modules.export.readData = readData;

// (async () => console.log(await readData(datapath)))();
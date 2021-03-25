const fs = require('fs');

let disassembler = files => {
  let result = [];
  let data = files.split('\n');
  let headers = data.shift().split(',');
  result.push(headers);
  for (let i = 0; i < data.length-1; i++) {
    let record = data[i];
    record = record.split(',');
    record = record.slice(1, record.length-1);
    result.push(record);
  }
  return result;
}

let reader = async (file) => {
  return new Promise((resolve, reject) => {
    let records = [];
    const stream = fs.createReadStream(file, {encoding: 'utf8'});
    stream.on('error', reject);
    stream.on('data', data => records = records.concat(disassembler(data)));
    stream.on('close', () => resolve(records));
  });
}

let csvreader = async (filepath) => await reader(filepath);

let slowreader = async (filepath) => {
  let data = fs.readFileSync(filepath, 'utf8');
  data = disassembler(data)
  return data;
}

module.exports.csvreader = csvreader;
module.exports.slowreader = slowreader;

// (async () => console.log(await readData(datapath)))();
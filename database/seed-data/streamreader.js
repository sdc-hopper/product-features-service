const fs = require('fs');

let filepath = 'database/seed-data/csvData/data.csv';

let reader = async (file) => {
  const stream = fs.createReadStream(file, {encoding: 'utf8'});
  let result = {};

  stream.on('data', file => {
    let data = file.split('\n');
    let headers = data.shift().split(',');
    result.headers = headers;
    for (let i = 0; i < data.length-1; i++) {
      let record = data[i];
      record = record.split(',');
      record = record.slice(1, record.length-1);
      result[i] = record;
    }
    return result;
  })

  stream.on('close', () => {
    console.log('FINISHED!');
    return result;
  });
}


(async () => console.log(await reader(filepath)))();
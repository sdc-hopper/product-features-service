const fs = require('fs')
const faker = require('faker');

let fakeHeader = () => faker.lorem.sentence().slice(0, -1);
let fakeSentence = () => faker.lorem.sentence();
let fakeDescription = () => faker.lorem.sentences();
let fakeTitle = () => faker.name.jobArea();

let header = () => 'recordid,productid,header,description,type';

let featureString = (recordid, productid, type) => {
  return `${recordid},${productid},${fakeHeader()},${fakeDescription()},${type}`;
}

let addFeatureString = (recordid, productid, type) => {
  return `${recordid},${productid},${fakeTitle()},${fakeDescription()},${type}`;
}

let generate = (count, startingid, startingrecordid) => {
  let records = header();
  let productid = 1000 + startingid;
  let recordid = startingrecordid;
  for (let i = 0; i < count; i++) {
    for (let j = 0; j < 7; j++) {
      records += '\n';
      records += featureString(recordid++, productid, 'feature');
    }
    for (let j = 0; j < 3; j++) {
      records += '\n';
      records += featureString(recordid++, productid, 'setup');
    }
    for (let j = 0; j < 2; j++) {
      records += '\n';
      records += featureString(recordid++, productid, 'banner');
    }
    records += '\n';
    records += featureString(recordid++, productid, 'addtional');
    for (let j = 0; j < 5; j++) {
      records += '\n';
      records += addFeatureString(recordid++, productid, 'addfeature');
    }
    productid++;
  }
  return records;
}

let writer = async (batches) => {
  for (let curr = 0; curr < batches; curr++) {
    let data = generate(25000, curr * 25000, curr * 450000);
    fs.writeFileSync(`/Users/Shared/sdcdata/data${curr}.csv`, data);
    console.log('Done with batch ', curr);
  }
}

// Seeds 2 million records
writer(80)

module.exports.generator = generator;
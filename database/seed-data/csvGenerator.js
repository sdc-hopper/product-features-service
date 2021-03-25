const fs = require('fs')
const faker = require('faker');

let fakeHeader = () => faker.lorem.sentence().slice(0, -1);
let fakeSentence = () => faker.lorem.sentence();
let fakeDescription = () => faker.lorem.sentences();
let fakeTitle = () => faker.name.jobArea();

let productid = 1000;

const headers = () => [
  'productid', 'banner.header', 'banner.text__1', 'banner.text__2',
  'feature.header__1', 'feature.description__1',
  'feature.header__2', 'feature.description__2',
  'feature.header__3', 'feature.description__3',
  'feature.header__4', 'feature.description__4',
  'feature.header__5', 'feature.description__5',
  'feature.header__6', 'feature.description__6',
  'feature.header__7', 'feature.description__7',
  'setup.header', 'setup.description__1', 'setup.description__2', 'setup.description__3',
  'additional.header', 'additional.description',
  'additionalFeature.header__1', 'additionalFeature.description__1',
  'additionalFeature.header__2', 'additionalFeature.description__2',
  'additionalFeature.header__3', 'additionalFeature.description__3',
  'additionalFeature.header__4', 'additionalFeature.description__4',
  'additionalFeature.header__5', 'additionalFeature.description__5'
];

const row = () => {
  return [
    productid++,
    //banner
    fakeHeader(), fakeDescription(), fakeDescription(),
    //features
    fakeHeader(), fakeDescription(), fakeHeader(), fakeDescription(), fakeHeader(), fakeDescription(),
    fakeHeader(), fakeDescription(), fakeHeader(), fakeDescription(), fakeHeader(), fakeDescription(),
    fakeHeader(), fakeDescription(),
    //setup
    fakeHeader(), '1. '+fakeSentence(), '2. '+fakeSentence(),'3. '+fakeSentence(),
    //additional
    fakeHeader(), fakeDescription(),
    //additionalfeatures
    fakeTitle(), fakeDescription(), fakeTitle(), fakeDescription(), fakeTitle(), fakeDescription(),
    fakeTitle(), fakeDescription(), fakeTitle(), fakeDescription()
  ]
}

const generator = (count) => {
  let records = [];
  records = records.concat(headers())
  records.push('\n');
  for (let i = 0; i < count; i++) {
    records = records.concat(row());
    records.push('\n');
  }
  fs.writeFile('database/seed-data/csvData/data.csv', records, () => console.log('done'));
}

module.exports.generator = generator;
const faker = require('faker');

let fakeHeader = () => faker.lorem.sentence().slice(0, -1);
let fakeSentence = () => faker.lorem.sentence();
let fakeDescription = () => faker.lorem.sentences();
let fakeTitle = () => faker.name.jobArea();

let fakeDataGenerator = (recordsToCreate, startingRecordID) => {

  if (recordsToCreate === undefined || startingRecordID === undefined) {
    throw new Error('Must include recordsToCreate and startingRecordID params');
  }

  let data = [];

  while (recordsToCreate > 0) {
    data.push({
      productId: startingRecordID,
      banner: {
        header: fakeHeader(),
        text: [fakeDescription(), fakeDescription()]
      },
      features: [
        {
          header: fakeHeader(),
          description: fakeDescription()
        },
        {
          header: fakeHeader(),
          description: fakeDescription()
        },
        {
          header: fakeHeader(),
          description: fakeDescription()
        },
        {
          header: fakeHeader(),
          description: fakeDescription()
        },
        {
          header: fakeHeader(),
          description: fakeDescription()
        },
        {
          header: fakeHeader(),
          description: fakeDescription()
        },
        {
          header: fakeHeader(),
          description: fakeDescription()
        }
      ],
      featureSetup: {
        header: fakeHeader(),
        description: ['1. ' + fakeSentence(), '2. ' + fakeSentence(), '3. '+ fakeSentence()]
      },
      additionalFeatures: {
        header: fakeHeader(),
        description: fakeDescription(),
        contentGrid: [
          {
            title: fakeTitle(),
            description: fakeDescription()
          },
          {
            title: fakeTitle(),
            description: fakeDescription()
          },
          {
            title: fakeTitle(),
            description: fakeDescription()
          },
          {
            title: fakeTitle(),
            description: fakeDescription()
          },
          {
            title: fakeTitle(),
            description: fakeDescription()
          },
        ]
      }
    });

    recordsToCreate--;
    startingRecordID++;
  }

  return data;
};

let makeFakeRecord = () => {
  return { header: fakeHeader(), description: fakeDescription() };
}

let fakeDataGenerator2 = (recordsToCreate, startingRecordID) => {

  if (recordsToCreate === undefined || startingRecordID === undefined) {
    throw new Error('Must include recordsToCreate and startingRecordID params');
  }

  let data = [];

  let getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max) + 1);
  }

  while (recordsToCreate > 0) {
    let features = [[...Array(7)].map(_=>makeFakeRecord())];
    let additionalFeatureGrid = [[...Array(6)].map(_=>makeFakeRecord())];
    let banner = { header: fakeHeader(), text: [fakeDescription(), fakeDescription()] };
    let featureSetup = {
      header: fakeHeader(),
      description: ['1. ' + fakeSentence(), '2. ' + fakeSentence(), '3. '+ fakeSentence()]
    }

    let record = {
      productId: startingRecordID,
      banner,
      features,
      featureSetup,
      additionalFeatures: {
        header: fakeHeader(),
        description: fakeDescription(),
        contentGrid: additionalFeatureGrid
      }
    }

    data.push(record);

    recordsToCreate--;
    startingRecordID++;
  }

  return data;
};

module.exports.fakeDataGenerator = fakeDataGenerator;
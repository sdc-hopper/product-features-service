const mongoose = require('mongoose');
const ProductFeatures = require('../database.js');
const { fakeDataGenerator } = require('./fakeDataGenerator.js');
const { fakeDataRecord } = require('./fakeDataRecord.js');

function fakeDataGeneratorTwo(size, id) {
  let result = [];
  for (let i = id; i < size + id; i++) {
    result.push({ productId: i});
  }
  return result;
}

async function seedDatabaseMany(fakeData, startingRecordID) {
  await ProductFeatures.insertMany(fakeData)
  .catch((err) => console.log('Error seeding database.', err))
}

async function seedDatabase(numRecordsToCreate, startingRecordID=1000, batchSize=100) {
  try {
    (async () => {
      try {
        await mongoose.connect('mongodb://localhost/fec_product_features', {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
          useCreateIndex: true
        });
      } catch (error) {
        console.log('connection error', err);
      }
    })();

    mongoose.connection.once('open', () => console.log('Mongoose connection established for seeding.'));

    await ProductFeatures.deleteMany({});
    console.log('Clearning ProductFeatures database collection before seeding.');

    let recordId = startingRecordID;

    for (let batch = 0; batch < numRecordsToCreate; batch += batchSize) {
      await (async (id) => {
        let fakeData = await fakeDataGenerator(batchSize, recordId + id);
        // let fakeData = fakeDataGeneratorTwo(batchSize, recordId + id)
        await seedDatabaseMany(fakeData, recordId + id);
        if (id % 10000 === 0) { console.log('At record: ', id)}
      })(batch);
    }

    await ProductFeatures.findOneAndUpdate({ productId: startingRecordID }, fakeDataRecord, {
      returnOriginal: false
    })

    let totalRecords = await ProductFeatures.countDocuments();
    console.log('Seeded ', totalRecords)

    mongoose.connection.close();
  }
  catch(error) {
    // catch fakeDataGenerator error
    console.log(error);
    mongoose.connection.close();
  }
}


(async () => {
  await seedDatabase(1000000, 1000, 1000);
})()

module.exports.seedDatabase = seedDatabase;
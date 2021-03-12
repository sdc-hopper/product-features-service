const { fakeDataGenerator } = require('./fakeDataGenerator.js');

let number = 100000

let vals = fakeDataGenerator(number, 1000);
console.log(vals.length)
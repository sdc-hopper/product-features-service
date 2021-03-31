const mongoose = require('mongoose');

// open mongoose connection
mongoose.connect('mongodb://localhost/fec_product_features', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

const productFeaturesSchema = new mongoose.Schema({
  productId: {
    type: Number,
    unique: true
  },
  banner: {
    header: String,
    text: [{type: String}]
  },
  features: [{
    header: String,
    description: String
  }],
  featureSetup: {
    header: String,
    description: [{type: String}]
  },
  additionalFeatures: {
    header: String,
    description: String,
    contentGrid: [{
      title: String,
      description: String
    }]
  }
});

const ProductFeatures = mongoose.model('ProductFeatures', productFeaturesSchema);

const load = (productId, callback) => {
  ProductFeatures.find({ productId: productId })
    .exec((err, data) => {
      // if error, return error
      if (err) {
        console.log(`Error loading product ${productId} from database`, err);
        callback(err);
      }
      // else if product does not exist, create and send error
      // db.collections.find() does not return error when no query match
      else if (data[0] === undefined || !data[0].productId) {
        console.log(`Error: product ${productId} does not exist`);
        callback(new Error('Product not found!'));
      }
      // else document record at productId exists, so send data
      else {
        callback(null, data);
      }
    });
}

module.exports = ProductFeatures;
module.exports.load = load;

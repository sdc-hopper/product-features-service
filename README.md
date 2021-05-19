# Amazon Product Page - Product Features

> System Design Capstone (SDC) Project

Microservice for product features for a given product built around SOA e-commerce application. Each individual feature, identified by a given product id, has fearures including a product banner, a list of features, setup features, and additional features beyond the basic level. Database is set up in PostgreSQL, including seeding script for generating dummy records to database. Server is run off Express.js, and front end is based off legacy code developed in React.

## Related Projects

  - https://github.com/sdc-hopper/

### Getting Started

From within the root directory:

```sh
npm install -g webpack
npm install
```

To build front end bundle file:
```sh
npm run build
```

To seed database with 1 million fake records:
```sh
npm run seed
```

To run app in production mode:
```sh
npm run start
```

To see app running, go to http://localhost:4000


## CRUD Api Calls

For Create: "/product-features/create/" POST\
REQUIRED productId,\
REQUIRED banner(header, text),\
REQUIRED features(banner, description),\
REQUIRED featureSetup(header, description),\
REQUIRED additionalFeatures(header, description, contentGrid[title, descrption])

For Read: "/product-features/:id" GET\
REQUIRED productId

for Update: "/product-features/update/:id" PUT\
REQUIRED productId,\
OPTIONAL banner(header, text),\
OPTIONAL features(banner, description),\
OPTIONAL featureSetup(header, description),\
OPTIONAL additionalFeatures(header, description, contentGrid[title, descrption])

for Delete: "/product-features/delete/:id" DELETE\
REQUIRED productId

## Data structure

schema = {\
  productId: {
    type: Number,
    unique: true
  },\
  banner: {
    header: String,
    text: [{type: String}]
  },\
  features: [{
    header: String,
    description: String
  }],\
  featureSetup: {
    header: String,
    description: [{type: String}]
  },\
  additionalFeatures: {
    header: String,
    description: String,
    contentGrid: [{
      title: String,
      description: String
    }]
  }
});
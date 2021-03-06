# Amazon Product Page - Product Features

> System Design Capstone (SDC) Project

## Related Projects

  - https://github.com/sdc-hopper/

## Table of Contents

1. [Development](#development)
2. [CRUD_API]

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install
```

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
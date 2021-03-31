const express = require('express');
const app = express();
const port = 4000;
const path = require('path');
const cors = require('cors');
const pgdb = require('../database/postgresdb.js')

app.use(cors());
app.use('/', express.static(path.join(__dirname + '/../public')));
app.use('/:id', express.static(path.join(__dirname + '/../public')));

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}

app.get('/product-features/:id', (req, res) => {
  const productId = req.params.id;
  console.log('Serving request for product: ', productId);
  pgdb.load(productId)
  .then(record => res.json(record))
  .catch(err => res.sendStatus(404));
});

const server = app.listen(port, () => {
  console.log(`Express server for Product Features Service listening at port ${port}`);
});

module.exports = server;
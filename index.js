require('dotenv').config();
const knex = require('./connection');
const cheerio = require('cheerio');
fs = require('fs');
const express = require('express');

const app = express();

const PORT = process.env.PORT;

app.post('/', async (req, res) => {
  const nfe = fs
    .readFileSync(
      './Nota Fiscal de Consumidor Eletrônica - NFC-e __ Consulta DANFE NFC-e.html'
    )
    .toString();

  const $ = cheerio.load(nfe);

  const elemSelector = '.txtTit';

  const productsAndPrice = [];
  const onlyProducts = [];
  const onlyTotalPrice = [];
  const productsFormatted = [];

  $(elemSelector).each(function (i, elem) {
    productsAndPrice.push($(this).text());
  });

  for (const product of productsAndPrice) {
    const index = productsAndPrice.indexOf(product);

    if (index % 2 === 0) {
      onlyProducts.push(product);
    } else {
      onlyTotalPrice.push(
        Number(product.replace(',', '').replace('Vl. Total', ''))
      );
    }
  }

  for (const product of onlyProducts) {
    let productFormatted;
    for (const string of product) {
      if (string === '-') {
        const indexOfDash = product.indexOf(string);

        productFormatted = product.slice(0, indexOfDash).trim();
      }
    }
    productsFormatted.push(productFormatted);
  }

  try {
    for (let i = 0; i < productsFormatted.length; i++) {
      const product = productsFormatted[i];
      const price = onlyTotalPrice[i];
      const productDB = await knex('purchases').insert({
        description: product,
        total_price: price
      });
    }

    const purchases = await knex('purchases').select(
      'description',
      'total_price'
    );

    return res.json(purchases);
  } catch (error) {
    return res.status(500).json({message: error.message});
  }

  // return res.json({ products: productsFormatted, totalPrice: onlyTotalPrice });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

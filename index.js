require('dotenv').config();
const knex = require('./connection');
const cheerio = require('cheerio');
fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());

const PORT = process.env.PORT;

app.post('/', async (req, res) => {
  const nfe = fs
    .readFileSync(
      './Nota Fiscal de Consumidor Eletrônica - NFC-e __ Consulta DANFE NFC-e.html'
    )
    .toString();

  const $ = cheerio.load(nfe);

  const elemSelectorTitle = '.txtTit';

  const productsAndPrice = [];
  const onlyProducts = [];
  const onlyTotalPrice = [];
  const productsFormatted = [];

  $(elemSelectorTitle).each(function (i, elem) {
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

  const elemSelectorAmount = '.Rqtd';

  const amounts = [];
  const amountsFormatted = [];

  $(elemSelectorAmount).each(function (i, elem) {
    amounts.push($(this).text());
  });

  for (const amount of amounts) {
    amountsFormatted.push(
      amount.replace(',', '.').replace('\n', '').replace('Qtde.:', '').trim()
    );
  }

  const elemSelectorUnPrice = '.RvlUnit';

  const unPrices = [];
  const unPricesFormatted = [];

  $(elemSelectorUnPrice).each(function (i, elem) {
    unPrices.push($(this).text());
  });

  for (const unPrice of unPrices) {
    unPricesFormatted.push(
      unPrice
        .replace(',', '.')
        .replace('\n', '')
        .replace('Vl. Unit.:', '')
        .trim()
    );
  }

  const elemSelectorPlace = '.txtTopo';
  const purchasePlace = $(elemSelectorPlace).text();

  try {
    // for (let i = 0; i < productsFormatted.length; i++) {
    //   const product = productsFormatted[i];
    //   const price = onlyTotalPrice[i];
    //   const amount = amountsFormatted[i];
    //   const unPrice = unPricesFormatted[i];
    //   const productDB = await knex('purchases').insert({
    //     description: product,
    //     total_price: price,
    //     amount: amount,
    //     unit_price: unPrice,
    //     place: purchasePlace
    //   });
    // }

    let purchases = await knex('purchases').select(
      'description',
      'total_price'
    );

    for (const purchase of purchases) {
      purchase.total_price /= 100;
    }

    return res.json(purchases);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

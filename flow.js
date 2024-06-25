const axios = require('axios');
const crypto = require('crypto');

const APIKEY = '5737EF2A-C228-4AA7-AAAE-8F69FC86LF19';
const SECRET = '66e3eaf21090fceff589659881baa31bbd05d36a';

async function createPayment(order) {
  const endpoint = 'https://www.flow.cl/api/payment/create';

  const params = {
    apiKey: APIKEY,
    commerceOrder: order.commerceOrder,
    subject: order.subject,
    currency: 'CLP',
    amount: order.amount,
    email: order.email,
    urlConfirmation: 'https://tusitio.com/confirmation',
    urlReturn: 'https://tusitio.com/return'
  };

  const paramsString = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');

  const sign = crypto
    .createHmac('sha256', SECRET)
    .update(paramsString)
    .digest('hex');

  const data = { ...params, s: sign };

  try {
    const response = await axios.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Error creating payment: ', error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = { createPayment };
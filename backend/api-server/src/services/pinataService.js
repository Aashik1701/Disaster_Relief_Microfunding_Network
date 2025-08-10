const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;

const pinFileToIPFS = async (fileBuffer, fileName) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const data = new FormData();
  data.append('file', fileBuffer, fileName);

  const res = await axios.post(url, data, {
    maxContentLength: 'Infinity',
    headers: {
      ...data.getHeaders(),
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_API_SECRET,
    },
  });
  return res.data;
};

module.exports = { pinFileToIPFS };
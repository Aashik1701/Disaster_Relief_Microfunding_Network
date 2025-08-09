const axios = require('axios');
const FormData = require('form-data');

class PinataService {
  constructor() {
    this.apiUrl = 'https://api.pinata.cloud';
    this.apiKey = process.env.PINATA_API_KEY;
    this.secretKey = process.env.PINATA_SECRET_KEY;
    this.jwt = process.env.PINATA_JWT;
  }

  async uploadFile(fileBuffer, fileName, metadata = {}) {
    const formData = new FormData();
    formData.append('file', fileBuffer, fileName);
    
    if (Object.keys(metadata).length > 0) {
      formData.append('pinataMetadata', JSON.stringify({
        name: fileName,
        keyvalues: metadata
      }));
    }

    const response = await axios.post(
      `${this.apiUrl}/pinning/pinFileToIPFS`,
      formData,
      {
        headers: {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey,
          ...formData.getHeaders()
        }
      }
    );

    return {
      hash: response.data.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
      size: response.data.PinSize,
      timestamp: response.data.Timestamp
    };
  }

  async uploadJSON(jsonData, name) {
    const response = await axios.post(
      `${this.apiUrl}/pinning/pinJSONToIPFS`,
      {
        pinataContent: jsonData,
        pinataMetadata: { name }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey
        }
      }
    );

    return {
      hash: response.data.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
    };
  }

  async getFileMetadata(hash) {
    const response = await axios.get(
      `${this.apiUrl}/data/pinList?hashContains=${hash}`,
      {
        headers: {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey
        }
      }
    );

    return response.data.rows[0] || null;
  }

  async unpinFile(hash) {
    const response = await axios.delete(
      `${this.apiUrl}/pinning/unpin/${hash}`,
      {
        headers: {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey
        }
      }
    );

    return response.data;
  }
}

module.exports = new PinataService();
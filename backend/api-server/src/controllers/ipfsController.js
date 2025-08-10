const { pinFileToIPFS } = require('../services/pinataService');

exports.uploadToIPFS = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const result = await pinFileToIPFS(req.file.buffer, req.file.originalname);
    res.json({ cid: result.IpfsHash, url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
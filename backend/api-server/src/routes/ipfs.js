const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const ipfsController = require('../controllers/ipfsController');

router.post('/upload', upload.single('file'), ipfsController.uploadToIPFS);

module.exports = router;
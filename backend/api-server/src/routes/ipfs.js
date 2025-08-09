const express = require('express');
const router = express.Router();
const multer = require('multer');
const ipfsController = require('../controllers/ipfsController');
const auth = require('../middleware/auth');

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Upload file to IPFS
router.post('/upload', 
  auth.requireAuth,
  upload.single('file'),
  ipfsController.uploadFile
);

// Upload JSON to IPFS
router.post('/upload-json', 
  auth.requireAuth,
  ipfsController.uploadJSON
);

// Get file from IPFS
router.get('/get/:hash', ipfsController.getFile);

// Get file metadata
router.get('/metadata/:hash', ipfsController.getFileMetadata);

module.exports = router;
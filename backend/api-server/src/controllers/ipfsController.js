const pinataService = require('../services/pinataService');
const dataService = require('../services/dataService');

class IpfsController {
  async uploadFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }

      const { metadata = {} } = req.body;
      
      const result = await pinataService.uploadFile(
        req.file.buffer,
        req.file.originalname,
        {
          ...metadata,
          uploadedBy: req.user.walletAddress,
          timestamp: new Date().toISOString()
        }
      );
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async uploadJSON(req, res) {
    try {
      const { data, name } = req.body;
      
      if (!data) {
        return res.status(400).json({
          success: false,
          error: 'No data provided'
        });
      }
      
      const result = await pinataService.uploadJSON(data, name);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getFile(req, res) {
    try {
      const { hash } = req.params;
      
      const metadata = await pinataService.getFileMetadata(hash);
      
      if (!metadata) {
        return res.status(404).json({
          success: false,
          error: 'File not found'
        });
      }
      
      // Redirect to IPFS gateway
      res.redirect(`https://gateway.pinata.cloud/ipfs/${hash}`);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getFileMetadata(req, res) {
    try {
      const { hash } = req.params;
      
      const metadata = await pinataService.getFileMetadata(hash);
      
      if (!metadata) {
        return res.status(404).json({
          success: false,
          error: 'File not found'
        });
      }
      
      res.json({
        success: true,
        data: metadata
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new IpfsController();
const logger = require('../utils/logger');
const axios = require('axios');

class FraudDetection {
  constructor() {
    this.suspiciousPatterns = [
      'rapid_transactions',
      'unusual_amounts',
      'geographic_anomalies',
      'duplicate_transactions'
    ];
  }

  async analyzeTransaction(event) {
    try {
      const { transactionHash, blockNumber } = event;
      
      // Get transaction details
      const txDetails = await this.getTransactionDetails(transactionHash);
      
      // Check for suspicious patterns
      const alerts = [];
      
      // Check for rapid transactions
      if (await this.isRapidTransaction(txDetails.from)) {
        alerts.push({
          type: 'rapid_transactions',
          severity: 'medium',
          message: 'Rapid transaction pattern detected',
          address: txDetails.from
        });
      }
      
      // Check for unusual amounts
      if (this.isUnusualAmount(txDetails.value)) {
        alerts.push({
          type: 'unusual_amounts',
          severity: 'high',
          message: 'Unusual transaction amount detected',
          amount: txDetails.value
        });
      }
      
      // Send alerts if any suspicious patterns found
      if (alerts.length > 0) {
        await this.sendAlerts(alerts, transactionHash);
      }
      
    } catch (error) {
      logger.error('Error analyzing transaction:', error);
    }
  }

  async analyzeDisasterCreation(event) {
    try {
      const { transactionHash } = event;
      
      // Get transaction details
      const txDetails = await this.getTransactionDetails(transactionHash);
      
      // Check for suspicious patterns in disaster creation
      const alerts = [];
      
      // Check if creator has sufficient authority
      if (!await this.hasAuthority(txDetails.from)) {
        alerts.push({
          type: 'unauthorized_creation',
          severity: 'critical',
          message: 'Unauthorized disaster zone creation attempt',
          address: txDetails.from
        });
      }
      
      // Send alerts if any suspicious patterns found
      if (alerts.length > 0) {
        await this.sendAlerts(alerts, transactionHash);
      }
      
    } catch (error) {
      logger.error('Error analyzing disaster creation:', error);
    }
  }

  async verifyProof(ipfsHash) {
    try {
      // Verify IPFS hash format
      if (!this.isValidIpfsHash(ipfsHash)) {
        await this.sendAlerts([{
          type: 'invalid_proof',
          severity: 'medium',
          message: 'Invalid IPFS hash format',
          hash: ipfsHash
        }]);
        return false;
      }
      
      // Check if file exists on IPFS
      const exists = await this.checkIpfsFileExists(ipfsHash);
      if (!exists) {
        await this.sendAlerts([{
          type: 'missing_proof',
          severity: 'high',
          message: 'Proof file not found on IPFS',
          hash: ipfsHash
        }]);
        return false;
      }
      
      return true;
      
    } catch (error) {
      logger.error('Error verifying proof:', error);
      return false;
    }
  }

  async getTransactionDetails(txHash) {
    // This would typically query the blockchain for transaction details
    // Simplified for example
    return {
      from: '0x123...',
      to: '0x456...',
      value: '1000000000000000000',
      blockNumber: 12345
    };
  }

  async isRapidTransaction(address) {
    // Check if address has made multiple transactions in a short time
    // Simplified for example
    return false;
  }

  isUnusualAmount(amount) {
    // Check if amount is unusually high or low
    const threshold = ethers.utils.parseEther('10000'); // 10,000 ETH
    return amount.gt(threshold);
  }

  async hasAuthority(address) {
    // Check if address has authority to create disasters
    // Simplified for example
    return true;
  }

  isValidIpfsHash(hash) {
    return /^Qm[1-9A-HJ-NP-Za-km-z]{44,}$/.test(hash);
  }

  async checkIpfsFileExists(hash) {
    try {
      const response = await axios.head(`https://gateway.pinata.cloud/ipfs/${hash}`);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  async sendAlerts(alerts, txHash) {
    for (const alert of alerts) {
      logger.warn('🚨 Fraud alert:', {
        ...alert,
        txHash,
        timestamp: new Date().toISOString()
      });
      
      // Here you would integrate with notification services
      // to send alerts to administrators
    }
  }
}

module.exports = FraudDetection;
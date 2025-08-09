const { ethers } = require('ethers');
const logger = require('../utils/logger');
const FraudDetection = require('../analyzers/fraudDetection');

class ContractEventListener {
  constructor() {
    this.provider = null;
    this.contract = null;
    this.fraudDetection = new FraudDetection();
  }

  async start() {
    try {
      // Initialize provider
      this.provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
      
      // Initialize contract
      const contractABI = require('../../contracts/artifacts/DisasterReliefSystem.json').abi;
      this.contract = new ethers.Contract(
        process.env.DISASTER_RELIEF_CONTRACT,
        contractABI,
        this.provider
      );
      
      // Set up event listeners
      this.setupEventListeners();
      
      logger.info('🎧 Contract event listener started');
    } catch (error) {
      logger.error('❌ Failed to start contract event listener:', error);
      throw error;
    }
  }

  setupEventListeners() {
    // Listen for disaster zone creation
    this.contract.on('DisasterZoneCreated', async (zoneId, name, funding, event) => {
      try {
        logger.info('🆕 New disaster zone created:', {
          zoneId: zoneId.toString(),
          name,
          funding: ethers.utils.formatEther(funding),
          txHash: event.transactionHash
        });
        
        // Analyze for fraud patterns
        await this.fraudDetection.analyzeDisasterCreation(event);
        
      } catch (error) {
        logger.error('Error handling DisasterZoneCreated event:', error);
      }
    });

    // Listen for voucher redemptions
    this.contract.on('VoucherRedeemed', async (vendor, voucherId, amount, event) => {
      try {
        logger.info('💰 Voucher redeemed:', {
          vendor,
          voucherId: voucherId.toString(),
          amount: ethers.utils.formatEther(amount),
          txHash: event.transactionHash
        });
        
        // Analyze transaction for fraud
        await this.fraudDetection.analyzeTransaction(event);
        
      } catch (error) {
        logger.error('Error handling VoucherRedeemed event:', error);
      }
    });

    // Listen for proof of aid submissions
    this.contract.on('ProofOfAidSubmitted', async (proofId, voucherId, ipfsHash, event) => {
      try {
        logger.info('📸 Proof of aid submitted:', {
          proofId: proofId.toString(),
          voucherId: voucherId.toString(),
          ipfsHash,
          txHash: event.transactionHash
        });
        
        // Verify proof
        await this.fraudDetection.verifyProof(ipfsHash);
        
      } catch (error) {
        logger.error('Error handling ProofOfAidSubmitted event:', error);
      }
    });
  }

  async stop() {
    try {
      if (this.contract) {
        this.contract.removeAllListeners();
      }
      logger.info('🛑 Contract event listener stopped');
    } catch (error) {
      logger.error('Error stopping contract event listener:', error);
    }
  }
}

module.exports = ContractEventListener;
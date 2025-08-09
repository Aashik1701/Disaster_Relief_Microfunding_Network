import { ethers } from 'ethers';
import { DISASTER_RELIEF_ABI, MOCK_USDC_ABI, CONTRACT_ADDRESSES, CONTRACT_HELPERS } from '../contracts/index.js';
import toast from 'react-hot-toast';

/**
 * DisasterReliefContractService
 * Comprehensive service for interacting with deployed smart contracts
 */
export class DisasterReliefContractService {
  constructor(provider, signer) {
    this.provider = provider;
    this.signer = signer;
    this.disasterReliefContract = null;
    this.usdcContract = null;
    this.initialized = false;
  }

  /**
   * Initialize contract instances
   */
  async initialize() {
    try {
      if (CONTRACT_ADDRESSES.DISASTER_RELIEF_SYSTEM) {
        this.disasterReliefContract = new ethers.Contract(
          CONTRACT_ADDRESSES.DISASTER_RELIEF_SYSTEM,
          DISASTER_RELIEF_ABI,
          this.signer
        );
      }

      const usdcAddress = CONTRACT_ADDRESSES.MOCK_USDC || CONTRACT_ADDRESSES.FUJI_USDC;
      if (usdcAddress) {
        this.usdcContract = new ethers.Contract(
          usdcAddress,
          MOCK_USDC_ABI,
          this.signer
        );
      }

      this.initialized = true;
      console.log('Contract service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize contract service:', error);
      throw error;
    }
  }

  /**
   * Check if contracts are initialized
   */
  ensureInitialized() {
    if (!this.initialized || !this.disasterReliefContract) {
      throw new Error('Contract service not initialized');
    }
  }

  // =============================================
  // DISASTER ZONE MANAGEMENT
  // =============================================

  /**
   * Create a new disaster zone
   */
  async createDisasterZone(name, latitude, longitude, radiusKm, initialFundingUSDC) {
    this.ensureInitialized();
    
    try {
      const coords = CONTRACT_HELPERS.formatCoordinates(latitude, longitude);
      const radiusMeters = radiusKm * 1000;
      const fundingAmount = CONTRACT_HELPERS.formatUSDCAmount(initialFundingUSDC);

      const tx = await this.disasterReliefContract.createDisasterZone(
        name,
        coords.latitude,
        coords.longitude,
        radiusMeters,
        fundingAmount
      );

      const receipt = await tx.wait();
      
      // Extract zone ID from events
      const event = receipt.logs.find(log => {
        try {
          const parsed = this.disasterReliefContract.interface.parseLog(log);
          return parsed.name === 'DisasterZoneCreated';
        } catch {
          return false;
        }
      });

      const zoneId = event ? 
        this.disasterReliefContract.interface.parseLog(event).args.zoneId :
        null;

      toast.success(`Disaster zone "${name}" created successfully!`);
      return { 
        success: true, 
        txHash: tx.hash, 
        zoneId: zoneId ? Number(zoneId) : null 
      };
    } catch (error) {
      console.error('Error creating disaster zone:', error);
      toast.error('Failed to create disaster zone');
      throw error;
    }
  }

  /**
   * Get disaster zone information
   */
  async getDisasterZone(zoneId) {
    this.ensureInitialized();
    
    try {
      const zone = await this.disasterReliefContract.getDisasterZone(zoneId);
      
      return {
        id: Number(zone.id),
        name: zone.name,
        coordinates: CONTRACT_HELPERS.parseCoordinates(zone.latitude, zone.longitude),
        radius: Number(zone.radius),
        initialFunding: CONTRACT_HELPERS.parseUSDCAmount(zone.initialFunding),
        currentFunding: CONTRACT_HELPERS.parseUSDCAmount(zone.currentFunding),
        totalSpent: CONTRACT_HELPERS.parseUSDCAmount(zone.totalSpent),
        active: zone.active,
        createdAt: new Date(Number(zone.createdAt) * 1000),
        createdBy: zone.createdBy
      };
    } catch (error) {
      console.error('Error fetching disaster zone:', error);
      throw error;
    }
  }

  /**
   * Get disaster zone statistics
   */
  async getDisasterZoneStats(zoneId) {
    this.ensureInitialized();
    
    try {
      const stats = await this.disasterReliefContract.getDisasterZoneStats(zoneId);
      
      return {
        name: stats.name,
        active: stats.active,
        initialFunding: CONTRACT_HELPERS.parseUSDCAmount(stats.initialFunding),
        currentFunding: CONTRACT_HELPERS.parseUSDCAmount(stats.currentFunding),
        totalSpent: CONTRACT_HELPERS.parseUSDCAmount(stats.totalSpent),
        vendorCount: Number(stats.vendorCount)
      };
    } catch (error) {
      console.error('Error fetching disaster zone stats:', error);
      throw error;
    }
  }

  /**
   * Add funding to disaster zone
   */
  async addFunding(zoneId, amountUSDC) {
    this.ensureInitialized();
    
    try {
      const amount = CONTRACT_HELPERS.formatUSDCAmount(amountUSDC);
      const tx = await this.disasterReliefContract.addFunding(zoneId, amount);
      await tx.wait();
      
      toast.success(`Added $${amountUSDC} USDC to disaster zone`);
      return { success: true, txHash: tx.hash };
    } catch (error) {
      console.error('Error adding funding:', error);
      toast.error('Failed to add funding');
      throw error;
    }
  }

  // =============================================
  // VENDOR MANAGEMENT
  // =============================================

  /**
   * Register a new vendor
   */
  async registerVendor(vendorAddress, name, location, zoneId, ipfsKycHash) {
    this.ensureInitialized();
    
    try {
      const tx = await this.disasterReliefContract.registerVendor(
        vendorAddress,
        name,
        location,
        zoneId,
        ipfsKycHash
      );
      await tx.wait();
      
      toast.success(`Vendor "${name}" registered successfully`);
      return { success: true, txHash: tx.hash };
    } catch (error) {
      console.error('Error registering vendor:', error);
      toast.error('Failed to register vendor');
      throw error;
    }
  }

  /**
   * Verify a vendor
   */
  async verifyVendor(vendorAddress, zoneId) {
    this.ensureInitialized();
    
    try {
      const tx = await this.disasterReliefContract.verifyVendor(vendorAddress, zoneId);
      await tx.wait();
      
      toast.success('Vendor verified successfully');
      return { success: true, txHash: tx.hash };
    } catch (error) {
      console.error('Error verifying vendor:', error);
      toast.error('Failed to verify vendor');
      throw error;
    }
  }

  /**
   * Get vendor information
   */
  async getVendor(vendorAddress) {
    this.ensureInitialized();
    
    try {
      const vendor = await this.disasterReliefContract.getVendor(vendorAddress);
      
      return {
        address: vendor.vendorAddress,
        name: vendor.name,
        location: vendor.location,
        disasterZoneId: Number(vendor.disasterZoneId),
        ipfsKycHash: vendor.ipfsKycHash,
        verified: vendor.verified,
        totalRedeemed: CONTRACT_HELPERS.parseUSDCAmount(vendor.totalRedeemed),
        transactionCount: Number(vendor.transactionCount),
        reputationScore: Number(vendor.reputationScore),
        registeredAt: new Date(Number(vendor.registeredAt) * 1000)
      };
    } catch (error) {
      console.error('Error fetching vendor:', error);
      throw error;
    }
  }

  /**
   * Get vendors for a disaster zone
   */
  async getZoneVendors(zoneId) {
    this.ensureInitialized();
    
    try {
      const vendorAddresses = await this.disasterReliefContract.getZoneVendors(zoneId);
      
      const vendors = await Promise.all(
        vendorAddresses.map(address => this.getVendor(address))
      );
      
      return vendors;
    } catch (error) {
      console.error('Error fetching zone vendors:', error);
      throw error;
    }
  }

  // =============================================
  // VOUCHER MANAGEMENT
  // =============================================

  /**
   * Issue a voucher to a beneficiary
   */
  async issueVoucher(beneficiaryAddress, amountUSDC, zoneId, categories, expiryDays = 30) {
    this.ensureInitialized();
    
    try {
      const amount = CONTRACT_HELPERS.formatUSDCAmount(amountUSDC);
      const tx = await this.disasterReliefContract.issueVoucher(
        beneficiaryAddress,
        amount,
        zoneId,
        categories,
        expiryDays
      );
      
      const receipt = await tx.wait();
      
      // Extract voucher ID from events
      const event = receipt.logs.find(log => {
        try {
          const parsed = this.disasterReliefContract.interface.parseLog(log);
          return parsed.name === 'VoucherIssued';
        } catch {
          return false;
        }
      });

      const voucherId = event ?
        this.disasterReliefContract.interface.parseLog(event).args.voucherId :
        null;

      toast.success(`Voucher issued successfully (ID: ${voucherId})`);
      return { 
        success: true, 
        txHash: tx.hash, 
        voucherId: voucherId ? Number(voucherId) : null 
      };
    } catch (error) {
      console.error('Error issuing voucher:', error);
      toast.error('Failed to issue voucher');
      throw error;
    }
  }

  /**
   * Redeem a voucher
   */
  async redeemVoucher(voucherId, amountUSDC, category, ipfsHash) {
    this.ensureInitialized();
    
    try {
      const amount = CONTRACT_HELPERS.formatUSDCAmount(amountUSDC);
      const tx = await this.disasterReliefContract.redeemVoucher(
        voucherId,
        amount,
        category,
        ipfsHash
      );
      await tx.wait();
      
      toast.success(`Voucher ${voucherId} redeemed successfully`);
      return { success: true, txHash: tx.hash };
    } catch (error) {
      console.error('Error redeeming voucher:', error);
      toast.error('Failed to redeem voucher');
      throw error;
    }
  }

  /**
   * Get voucher information
   */
  async getVoucher(voucherId) {
    this.ensureInitialized();
    
    try {
      const voucher = await this.disasterReliefContract.getVoucher(voucherId);
      
      return {
        id: Number(voucher.id),
        beneficiary: voucher.beneficiary,
        amount: CONTRACT_HELPERS.parseUSDCAmount(voucher.amount),
        disasterZoneId: Number(voucher.disasterZoneId),
        allowedCategories: voucher.allowedCategories,
        createdAt: new Date(Number(voucher.createdAt) * 1000),
        expiryTime: new Date(Number(voucher.expiryTime) * 1000),
        used: voucher.used,
        usedBy: voucher.usedBy,
        usedAt: voucher.usedAt > 0 ? new Date(Number(voucher.usedAt) * 1000) : null
      };
    } catch (error) {
      console.error('Error fetching voucher:', error);
      throw error;
    }
  }

  /**
   * Get user vouchers
   */
  async getUserVouchers(userAddress) {
    this.ensureInitialized();
    
    try {
      const voucherIds = await this.disasterReliefContract.getUserVouchers(userAddress);
      
      const vouchers = await Promise.all(
        voucherIds.map(id => this.getVoucher(Number(id)))
      );
      
      return vouchers;
    } catch (error) {
      console.error('Error fetching user vouchers:', error);
      throw error;
    }
  }

  // =============================================
  // USDC TOKEN FUNCTIONS
  // =============================================

  /**
   * Get USDC balance
   */
  async getUSDCBalance(address) {
    if (!this.usdcContract) return '0';
    
    try {
      const balance = await this.usdcContract.balanceOf(address);
      return CONTRACT_HELPERS.parseUSDCAmount(balance).toString();
    } catch (error) {
      console.error('Error fetching USDC balance:', error);
      return '0';
    }
  }

  /**
   * Use MockUSDC faucet (for testing)
   */
  async useFaucet() {
    if (!this.usdcContract) throw new Error('USDC contract not available');
    
    try {
      const tx = await this.usdcContract.faucet();
      await tx.wait();
      
      toast.success('Received 1000 USDC from faucet');
      return { success: true, txHash: tx.hash };
    } catch (error) {
      console.error('Error using faucet:', error);
      toast.error('Failed to use faucet');
      throw error;
    }
  }

  /**
   * Transfer USDC
   */
  async transferUSDC(to, amountUSDC) {
    if (!this.usdcContract) throw new Error('USDC contract not available');
    
    try {
      const amount = CONTRACT_HELPERS.formatUSDCAmount(amountUSDC);
      const tx = await this.usdcContract.transfer(to, amount);
      await tx.wait();
      
      toast.success(`Transferred ${amountUSDC} USDC successfully`);
      return { success: true, txHash: tx.hash };
    } catch (error) {
      console.error('Error transferring USDC:', error);
      toast.error('Failed to transfer USDC');
      throw error;
    }
  }

  // =============================================
  // EVENT LISTENING
  // =============================================

  /**
   * Listen for contract events
   */
  setupEventListeners(callbacks = {}) {
    if (!this.disasterReliefContract) return;

    // Disaster zone events
    this.disasterReliefContract.on('DisasterZoneCreated', (zoneId, name, ...args) => {
      if (callbacks.onDisasterZoneCreated) {
        callbacks.onDisasterZoneCreated({ zoneId: Number(zoneId), name, args });
      }
    });

    // Voucher events
    this.disasterReliefContract.on('VoucherIssued', (voucherId, beneficiary, ...args) => {
      if (callbacks.onVoucherIssued) {
        callbacks.onVoucherIssued({ voucherId: Number(voucherId), beneficiary, args });
      }
    });

    this.disasterReliefContract.on('VoucherRedeemed', (voucherId, vendor, beneficiary, amount, category) => {
      if (callbacks.onVoucherRedeemed) {
        callbacks.onVoucherRedeemed({ 
          voucherId: Number(voucherId), 
          vendor, 
          beneficiary, 
          amount: CONTRACT_HELPERS.parseUSDCAmount(amount),
          category 
        });
      }
    });

    // Proof events
    this.disasterReliefContract.on('ProofOfAidSubmitted', (proofId, voucherId, vendor, ipfsHash, category, amount) => {
      if (callbacks.onProofOfAidSubmitted) {
        callbacks.onProofOfAidSubmitted({ 
          proofId: Number(proofId), 
          voucherId: Number(voucherId),
          vendor,
          ipfsHash,
          category,
          amount: CONTRACT_HELPERS.parseUSDCAmount(amount)
        });
      }
    });
  }

  /**
   * Remove all event listeners
   */
  removeEventListeners() {
    if (this.disasterReliefContract) {
      this.disasterReliefContract.removeAllListeners();
    }
  }
}

export default DisasterReliefContractService;

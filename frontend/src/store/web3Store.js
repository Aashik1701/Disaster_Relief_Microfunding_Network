import { create } from 'zustand'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'
import { DisasterReliefContractService } from '../services/contractService.js'

// Avalanche network configuration
const AVALANCHE_CONFIG = {
  chainId: 43113, // Fuji testnet
  chainName: 'Avalanche Fuji Testnet',
  nativeCurrency: {
    name: 'AVAX',
    symbol: 'AVAX',
    decimals: 18,
  },
  rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://testnet.snowtrace.io/'],
}

export const useWeb3Store = create((set, get) => ({
  // Connection state
  isConnected: false,
  isConnecting: false,
  isInitialized: false,
  account: null,
  provider: null,
  signer: null,
  chainId: null,
  balance: '0',
  usdcBalance: '0',

  // Contract service
  contractService: null,

  // User role and permissions
  userRole: null, // 'admin', 'vendor', 'donor', 'victim'
  permissions: [],

  // Contract data
  disasterZones: [],
  vendors: [],
  vouchers: [],

  // Initialize Web3 connection
  initialize: async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum)
        
        // Check if already connected
        const accounts = await provider.send('eth_accounts', [])
        if (accounts.length > 0) {
          await get().connectWallet()
        }
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          if (accounts.length === 0) {
            get().disconnect()
          } else {
            get().connectWallet()
          }
        })

        // Listen for chain changes
        window.ethereum.on('chainChanged', (chainId) => {
          window.location.reload()
        })
      }
      
      set({ isInitialized: true })
    } catch (error) {
      console.error('Web3 initialization error:', error)
      toast.error('Failed to initialize Web3')
      set({ isInitialized: true })
    }
  },

  // Connect wallet
  connectWallet: async () => {
    const state = get()
    if (state.isConnecting) return

    set({ isConnecting: true })

    try {
      if (typeof window.ethereum === 'undefined') {
        toast.error('Please install MetaMask or another Web3 wallet')
        return
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      
      // Request account access
      await provider.send('eth_requestAccounts', [])
      
      const signer = await provider.getSigner()
      const account = await signer.getAddress()
      const network = await provider.getNetwork()
      
      // Check if on correct network
      if (network.chainId !== BigInt(AVALANCHE_CONFIG.chainId)) {
        await get().switchToAvalanche()
      }

      // Get balance
      const balance = await provider.getBalance(account)
      const formattedBalance = ethers.formatEther(balance)

      // Initialize contract service
      const contractService = new DisasterReliefContractService(provider, signer)
      await contractService.initialize()

      // Get USDC balance
      const usdcBalance = await contractService.getUSDCBalance(account)

      // Determine user role
      const userRole = await get().determineUserRole(account, contractService)

      set({
        isConnected: true,
        isConnecting: false,
        account,
        provider,
        signer,
        chainId: Number(network.chainId),
        balance: formattedBalance,
        usdcBalance,
        userRole,
        contractService,
      })

      // Setup event listeners
      contractService.setupEventListeners({
        onDisasterZoneCreated: (data) => {
          console.log('Disaster zone created:', data)
          get().refreshDisasterZones()
        },
        onVoucherIssued: (data) => {
          console.log('Voucher issued:', data)
          get().refreshVouchers()
        },
        onVoucherRedeemed: (data) => {
          console.log('Voucher redeemed:', data)
          get().refreshVouchers()
          get().updateBalance()
        },
        onProofOfAidSubmitted: (data) => {
          console.log('Proof of aid submitted:', data)
        }
      })

      toast.success(`Connected as ${userRole}`)
    } catch (error) {
      console.error('Wallet connection error:', error)
      toast.error('Failed to connect wallet')
      set({ isConnecting: false })
    }
  },

  // Switch to Avalanche network
  switchToAvalanche: async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${AVALANCHE_CONFIG.chainId.toString(16)}` }],
      })
    } catch (switchError) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [AVALANCHE_CONFIG],
          })
        } catch (addError) {
          console.error('Failed to add Avalanche network:', addError)
          throw addError
        }
      } else {
        throw switchError
      }
    }
  },

  // Determine user role based on contract state
  determineUserRole: async (account, contractService) => {
    try {
      if (!contractService || !contractService.disasterReliefContract) {
        return 'donor' // Default role if contract not available
      }

      // Check if user has admin role
      const contract = contractService.disasterReliefContract
      const ADMIN_ROLE = ethers.keccak256(ethers.toUtf8Bytes('ADMIN_ROLE'))
      
      try {
        const hasAdminRole = await contract.hasRole(ADMIN_ROLE, account)
        if (hasAdminRole) return 'admin'
      } catch (error) {
        console.log('Admin role check failed, checking other roles...')
      }

      // Check if user is a registered vendor
      try {
        const vendor = await contractService.getVendor(account)
        if (vendor && vendor.address !== ethers.ZeroAddress) {
          return 'vendor'
        }
      } catch (error) {
        console.log('Vendor check failed, checking vouchers...')
      }

      // Check if user has active vouchers (victim)
      try {
        const vouchers = await contractService.getUserVouchers(account)
        if (vouchers && vouchers.length > 0) {
          const activeVouchers = vouchers.filter(v => !v.used && v.expiryTime > new Date())
          if (activeVouchers.length > 0) {
            return 'victim'
          }
        }
      } catch (error) {
        console.log('Voucher check failed, defaulting to donor role')
      }

      return 'donor' // Default role
    } catch (error) {
      console.error('Role determination error:', error)
      return 'donor'
    }
  },

  // Disconnect wallet
  disconnect: () => {
    const { contractService } = get()
    if (contractService) {
      contractService.removeEventListeners()
    }
    
    set({
      isConnected: false,
      account: null,
      provider: null,
      signer: null,
      chainId: null,
      balance: '0',
      usdcBalance: '0',
      userRole: null,
      permissions: [],
      contractService: null,
      disasterZones: [],
      vendors: [],
      vouchers: [],
    })
    toast.success('Wallet disconnected')
  },

  // Update balance
  updateBalance: async () => {
    const { provider, account, contractService } = get()
    if (!provider || !account) return

    try {
      const balance = await provider.getBalance(account)
      const formattedBalance = ethers.formatEther(balance)
      
      let usdcBalance = '0'
      if (contractService) {
        usdcBalance = await contractService.getUSDCBalance(account)
      }
      
      set({ balance: formattedBalance, usdcBalance })
    } catch (error) {
      console.error('Balance update error:', error)
    }
  },

  // Data refresh functions
  refreshDisasterZones: async () => {
    const { contractService } = get()
    if (!contractService) return

    try {
      // Get all disaster zones (this would need to be implemented based on events or contract methods)
      // For now, we'll set up the structure
      set({ disasterZones: [] })
    } catch (error) {
      console.error('Error refreshing disaster zones:', error)
    }
  },

  refreshVouchers: async () => {
    const { contractService, account } = get()
    if (!contractService || !account) return

    try {
      const vouchers = await contractService.getUserVouchers(account)
      set({ vouchers })
    } catch (error) {
      console.error('Error refreshing vouchers:', error)
    }
  },

  refreshVendors: async (zoneId) => {
    const { contractService } = get()
    if (!contractService) return

    try {
      if (zoneId) {
        const vendors = await contractService.getZoneVendors(zoneId)
        set({ vendors })
      }
    } catch (error) {
      console.error('Error refreshing vendors:', error)
    }
  },

  // Contract interaction helpers
  createDisasterZone: async (name, latitude, longitude, radiusKm, initialFundingUSDC) => {
    const { contractService } = get()
    if (!contractService) throw new Error('Contract service not available')

    return await contractService.createDisasterZone(name, latitude, longitude, radiusKm, initialFundingUSDC)
  },

  registerVendor: async (vendorAddress, name, location, zoneId, ipfsKycHash) => {
    const { contractService } = get()
    if (!contractService) throw new Error('Contract service not available')

    return await contractService.registerVendor(vendorAddress, name, location, zoneId, ipfsKycHash)
  },

  verifyVendor: async (vendorAddress, zoneId) => {
    const { contractService } = get()
    if (!contractService) throw new Error('Contract service not available')

    return await contractService.verifyVendor(vendorAddress, zoneId)
  },

  issueVoucher: async (beneficiaryAddress, amountUSDC, zoneId, categories, expiryDays = 30) => {
    const { contractService } = get()
    if (!contractService) throw new Error('Contract service not available')

    return await contractService.issueVoucher(beneficiaryAddress, amountUSDC, zoneId, categories, expiryDays)
  },

  redeemVoucher: async (voucherId, amountUSDC, category, ipfsHash) => {
    const { contractService } = get()
    if (!contractService) throw new Error('Contract service not available')

    return await contractService.redeemVoucher(voucherId, amountUSDC, category, ipfsHash)
  },

  useFaucet: async () => {
    const { contractService } = get()
    if (!contractService) throw new Error('Contract service not available')

    const result = await contractService.useFaucet()
    if (result.success) {
      await get().updateBalance()
    }
    return result
  },

  transferUSDC: async (to, amountUSDC) => {
    const { contractService } = get()
    if (!contractService) throw new Error('Contract service not available')

    const result = await contractService.transferUSDC(to, amountUSDC)
    if (result.success) {
      await get().updateBalance()
    }
    return result
  },
}))

// Initialize the store when the module loads
useWeb3Store.getState().initialize()

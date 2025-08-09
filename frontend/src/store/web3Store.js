import { create } from 'zustand'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'

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

// Contract addresses (to be updated after deployment)
const CONTRACT_ADDRESSES = {
  DisasterReliefSystem: import.meta.env.VITE_DISASTER_RELIEF_CONTRACT || '',
  USDC: import.meta.env.VITE_USDC_CONTRACT || '0x5425890298aed601595a70AB815c96711a31Bc65',
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

  // Contract instances
  disasterReliefContract: null,
  usdcContract: null,

  // User role and permissions
  userRole: null, // 'admin', 'vendor', 'donor', 'victim'
  permissions: [],

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

      // Initialize contracts
      const contracts = await get().initializeContracts(signer)

      // Determine user role
      const userRole = await get().determineUserRole(account, contracts.disasterReliefContract)

      set({
        isConnected: true,
        isConnecting: false,
        account,
        provider,
        signer,
        chainId: Number(network.chainId),
        balance: formattedBalance,
        userRole,
        ...contracts,
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

  // Initialize smart contracts
  initializeContracts: async (signer) => {
    try {
      let disasterReliefContract = null
      let usdcContract = null

      // Initialize Disaster Relief contract if address is available
      if (CONTRACT_ADDRESSES.DisasterReliefSystem) {
        const disasterReliefABI = [
          // Add contract ABI here when available
          'function createDisasterZone(string memory _name, int256 _lat, int256 _lng, uint256 _radius) external',
          'function registerVendor(address _vendorAddress, uint256 _disasterZoneId) external',
          'function issueVoucher(address _beneficiary, uint256 _amount, uint256 _disasterZoneId, string[] memory _allowedCategories) external',
          'function redeemVoucher(uint256 _voucherId, uint256 _amount, string memory _category, string memory _ipfsHash) external',
          'function disasterZones(uint256) external view returns (tuple)',
          'function vendors(address) external view returns (tuple)',
          'function vouchers(uint256) external view returns (tuple)',
          'event DisasterZoneCreated(uint256 indexed zoneId, string name)',
          'event VoucherIssued(address indexed beneficiary, uint256 amount, uint256 voucherId)',
          'event VoucherRedeemed(address indexed vendor, uint256 indexed voucherId, uint256 amount)',
        ]
        
        disasterReliefContract = new ethers.Contract(
          CONTRACT_ADDRESSES.DisasterReliefSystem,
          disasterReliefABI,
          signer
        )
      }

      // Initialize USDC contract
      if (CONTRACT_ADDRESSES.USDC) {
        const usdcABI = [
          'function balanceOf(address owner) external view returns (uint256)',
          'function transfer(address to, uint256 amount) external returns (bool)',
          'function transferFrom(address from, address to, uint256 amount) external returns (bool)',
          'function approve(address spender, uint256 amount) external returns (bool)',
          'function allowance(address owner, address spender) external view returns (uint256)',
          'function decimals() external view returns (uint8)',
        ]
        
        usdcContract = new ethers.Contract(
          CONTRACT_ADDRESSES.USDC,
          usdcABI,
          signer
        )
      }

      return { disasterReliefContract, usdcContract }
    } catch (error) {
      console.error('Contract initialization error:', error)
      return { disasterReliefContract: null, usdcContract: null }
    }
  },

  // Determine user role based on contract state
  determineUserRole: async (account, contract) => {
    try {
      if (!contract) return 'donor' // Default role if contract not available

      // Check if user has admin role
      const ADMIN_ROLE = ethers.keccak256(ethers.toUtf8Bytes('ADMIN_ROLE'))
      const hasAdminRole = await contract.hasRole(ADMIN_ROLE, account)
      if (hasAdminRole) return 'admin'

      // Check if user has vendor role
      const VENDOR_ROLE = ethers.keccak256(ethers.toUtf8Bytes('VENDOR_ROLE'))
      const hasVendorRole = await contract.hasRole(VENDOR_ROLE, account)
      if (hasVendorRole) return 'vendor'

      // Check if user has active vouchers (victim)
      // This would require additional contract methods to check voucher ownership

      return 'donor' // Default role
    } catch (error) {
      console.error('Role determination error:', error)
      return 'donor'
    }
  },

  // Disconnect wallet
  disconnect: () => {
    set({
      isConnected: false,
      account: null,
      provider: null,
      signer: null,
      chainId: null,
      balance: '0',
      userRole: null,
      permissions: [],
      disasterReliefContract: null,
      usdcContract: null,
    })
    toast.success('Wallet disconnected')
  },

  // Update balance
  updateBalance: async () => {
    const { provider, account } = get()
    if (!provider || !account) return

    try {
      const balance = await provider.getBalance(account)
      const formattedBalance = ethers.formatEther(balance)
      set({ balance: formattedBalance })
    } catch (error) {
      console.error('Balance update error:', error)
    }
  },

  // Get USDC balance
  getUSDCBalance: async () => {
    const { usdcContract, account } = get()
    if (!usdcContract || !account) return '0'

    try {
      const balance = await usdcContract.balanceOf(account)
      return ethers.formatUnits(balance, 6) // USDC has 6 decimals
    } catch (error) {
      console.error('USDC balance error:', error)
      return '0'
    }
  },

  // Approve USDC spending
  approveUSDC: async (spenderAddress, amount) => {
    const { usdcContract } = get()
    if (!usdcContract) throw new Error('USDC contract not initialized')

    try {
      const amountWei = ethers.parseUnits(amount.toString(), 6)
      const tx = await usdcContract.approve(spenderAddress, amountWei)
      await tx.wait()
      return tx.hash
    } catch (error) {
      console.error('USDC approval error:', error)
      throw error
    }
  },
}))

// Initialize the store when the module loads
useWeb3Store.getState().initialize()

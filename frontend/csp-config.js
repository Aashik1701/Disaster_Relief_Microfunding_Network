// CSP Configuration Manager for Avalanche Disaster Relief App
// This file helps manage Content Security Policy settings for different environments

const CSP_POLICIES = {
  development: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-eval'", // Required for Vite HMR in development
      "'unsafe-inline'", // Required for some dev tools
      "https://fonts.googleapis.com",
      "https://www.googletagmanager.com",
      "chrome-extension:", // Web3 wallet extensions
      "moz-extension:" // Firefox extensions
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for CSS-in-JS libraries
      "https://fonts.googleapis.com",
      "chrome-extension:",
      "moz-extension:"
    ],
    'font-src': [
      "'self'",
      "https://fonts.gstatic.com",
      "chrome-extension:",
      "moz-extension:"
    ],
    'img-src': [
      "'self'",
      "data:",
      "https:",
      "blob:",
      "chrome-extension:",
      "moz-extension:"
    ],
    'media-src': [
      "'self'",
      "blob:"
    ],
    'connect-src': [
      "'self'",
      "https://api.pinata.cloud", // IPFS storage
      "https://gateway.pinata.cloud", // IPFS gateway
      "https://api.avax-test.network", // Avalanche RPC
      "https://testnet.snowtrace.io", // Block explorer
      "wss://api.avax-test.network", // WebSocket connections
      "ws://localhost:*", // Local development
      "http://localhost:*", // Local development
      "chrome-extension:", // Web3 wallets
      "moz-extension:" // Firefox extensions
    ],
    'worker-src': [
      "'self'",
      "blob:"
    ],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'frame-src': [
      "'self'",
      "chrome-extension:",
      "moz-extension:"
    ]
  },

  production: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      // Remove 'unsafe-eval' in production
      "'unsafe-inline'", // Consider using nonces instead
      "https://fonts.googleapis.com",
      "https://www.googletagmanager.com"
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Consider using nonces instead
      "https://fonts.googleapis.com"
    ],
    'font-src': [
      "'self'",
      "https://fonts.gstatic.com"
    ],
    'img-src': [
      "'self'",
      "data:",
      "https:",
      "blob:"
    ],
    'media-src': [
      "'self'",
      "blob:"
    ],
    'connect-src': [
      "'self'",
      "https://api.pinata.cloud",
      "https://gateway.pinata.cloud",
      "https://api.avax-test.network",
      "https://testnet.snowtrace.io",
      "wss://api.avax-test.network"
    ],
    'worker-src': [
      "'self'",
      "blob:"
    ],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"]
  }
}

// Generate CSP string for given environment
function generateCSP(environment = 'development') {
  const policy = CSP_POLICIES[environment]
  
  if (!policy) {
    throw new Error(`Unknown environment: ${environment}`)
  }

  const cspDirectives = Object.entries(policy)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ')

  return cspDirectives
}

// Generate meta tag for HTML
function generateCSPMetaTag(environment = 'development') {
  const csp = generateCSP(environment)
  return `<meta http-equiv="Content-Security-Policy" content="${csp}" />`
}

// Validate current CSP against requirements
function validateCSP(environment = 'development') {
  const requirements = {
    web3Wallets: ['chrome-extension:', 'moz-extension:'],
    avalancheRPC: ['https://api.avax-test.network'],
    ipfsStorage: ['https://api.pinata.cloud', 'https://gateway.pinata.cloud'],
    fonts: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
    development: environment === 'development' ? ["'unsafe-eval'"] : []
  }

  const policy = CSP_POLICIES[environment]
  const issues = []

  // Check if all requirements are met
  Object.entries(requirements).forEach(([category, sources]) => {
    sources.forEach(source => {
      const found = Object.values(policy).some(directive => 
        directive.includes(source)
      )
      if (!found) {
        issues.push(`Missing ${category} source: ${source}`)
      }
    })
  })

  return {
    valid: issues.length === 0,
    issues
  }
}

module.exports = {
  CSP_POLICIES,
  generateCSP,
  generateCSPMetaTag,
  validateCSP
}

// Example usage:
if (require.main === module) {
  console.log('Development CSP:')
  console.log(generateCSPMetaTag('development'))
  console.log('\nProduction CSP:')
  console.log(generateCSPMetaTag('production'))
  
  const validation = validateCSP('development')
  console.log('\nValidation result:', validation)
}

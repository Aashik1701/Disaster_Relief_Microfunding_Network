/**
 * Enhanced API Service for backend integration
 * Handles HTTP requests with comprehensive error handling and offline support
 */

import { errorHandler, ERROR_CODES } from '../utils/errorHandler.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const REQUEST_TIMEOUT = 10000 // 10 seconds
const RETRY_ATTEMPTS = 3
const RETRY_DELAY = 1000 // 1 second

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
    this.headers = {
      'Content-Type': 'application/json',
    }
    this.requestQueue = []
    this.isOnline = navigator.onLine
    this.setupOfflineHandling()
  }

  /**
   * Set up offline handling
   */
  setupOfflineHandling() {
    window.addEventListener('online', () => {
      this.isOnline = true
      this.processOfflineQueue()
      errorHandler.showInfo('Connection restored. Syncing data...')
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      errorHandler.showWarning('You are offline. Changes will be synced when connection is restored.')
    })
  }

  /**
   * Set authentication token for requests
   */
  setAuthToken(token) {
    if (token) {
      this.headers['Authorization'] = `Bearer ${token}`
    } else {
      delete this.headers['Authorization']
    }
  }

  /**
   * Enhanced HTTP request handler with retry logic
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    const config = {
      headers: { ...this.headers, ...options.headers },
      timeout: options.timeout || REQUEST_TIMEOUT,
      ...options,
    }

    // Add request to queue if offline
    if (!this.isOnline && options.method !== 'GET') {
      return this.queueRequest(endpoint, config)
    }

    return this.executeRequest(url, config)
  }

  /**
   * Execute HTTP request with retry logic
   */
  async executeRequest(url, config, attempt = 1) {
    try {
      // Create AbortController for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), config.timeout)

      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data

    } catch (error) {
      // Handle timeout
      if (error.name === 'AbortError') {
        const timeoutError = new Error('Request timed out')
        timeoutError.code = 'TIMEOUT'
        throw timeoutError
      }

      // Handle network errors
      if (error.message.includes('fetch')) {
        const networkError = new Error('Network error - please check your connection')
        networkError.code = 'NETWORK_ERROR'
        throw networkError
      }

      // Retry logic for certain errors
      if (this.shouldRetry(error, attempt)) {
        await this.delay(RETRY_DELAY * attempt)
        return this.executeRequest(url, config, attempt + 1)
      }

      throw error
    }
  }

  /**
   * Determine if request should be retried
   */
  shouldRetry(error, attempt) {
    if (attempt >= RETRY_ATTEMPTS) return false
    
    // Retry on network errors, timeouts, and 5xx server errors
    return (
      error.code === 'NETWORK_ERROR' ||
      error.code === 'TIMEOUT' ||
      (error.response && error.response.status >= 500)
    )
  }

  /**
   * Delay utility for retry logic
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Queue request for offline processing
   */
  async queueRequest(endpoint, config) {
    const queuedRequest = {
      id: Date.now() + Math.random(),
      endpoint,
      config,
      timestamp: new Date().toISOString()
    }

    this.requestQueue.push(queuedRequest)
    
    // Store in localStorage for persistence
    try {
      localStorage.setItem('apiRequestQueue', JSON.stringify(this.requestQueue))
    } catch (error) {
      console.warn('Failed to save request queue to localStorage:', error)
    }

    errorHandler.showWarning('Request queued for when connection is restored')
    
    return {
      success: false,
      queued: true,
      queueId: queuedRequest.id
    }
  }

  /**
   * Process queued requests when back online
   */
  async processOfflineQueue() {
    if (this.requestQueue.length === 0) return

    const queue = [...this.requestQueue]
    this.requestQueue = []

    for (const queuedRequest of queue) {
      try {
        const url = `${this.baseURL}${queuedRequest.endpoint}`
        await this.executeRequest(url, queuedRequest.config)
        errorHandler.showSuccess(`Synced: ${queuedRequest.config.method || 'GET'} ${queuedRequest.endpoint}`)
      } catch (error) {
        errorHandler.handleError(error, { 
          context: 'Offline queue processing',
          endpoint: queuedRequest.endpoint 
        })
        // Re-queue failed requests
        this.requestQueue.push(queuedRequest)
      }
    }

    // Update localStorage
    try {
      localStorage.setItem('apiRequestQueue', JSON.stringify(this.requestQueue))
    } catch (error) {
      console.warn('Failed to update request queue in localStorage:', error)
    }
  }

  /**
   * Load queued requests from localStorage on initialization
   */
  loadQueueFromStorage() {
    try {
      const stored = localStorage.getItem('apiRequestQueue')
      if (stored) {
        this.requestQueue = JSON.parse(stored)
      }
    } catch (error) {
      console.warn('Failed to load request queue from localStorage:', error)
      this.requestQueue = []
    }
  }

  /**
   * Enhanced request wrapper with error handling
   */
  async safeRequest(endpoint, options = {}) {
    try {
      return await this.request(endpoint, options)
    } catch (error) {
      return errorHandler.handleError(error, {
        context: 'API Request',
        endpoint,
        method: options.method || 'GET'
      })
    }
  }

  // ==============================================
  // DISASTER ZONE API ENDPOINTS
  // ==============================================

  /**
   * Get all disaster zones
   */
  async getDisasterZones(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const endpoint = `/disasters${queryString ? `?${queryString}` : ''}`
    return this.request(endpoint)
  }

  /**
   * Get disaster zone by ID
   */
  async getDisasterZone(id) {
    return this.request(`/disasters/${id}`)
  }

  /**
   * Create new disaster zone
   */
  async createDisasterZone(data) {
    return this.request('/disasters', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Update disaster zone status
   */
  async updateDisasterStatus(id, status) {
    return this.request(`/disasters/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  }

  /**
   * Get disaster zone statistics
   */
  async getDisasterStats(id) {
    return this.request(`/disasters/${id}/stats`)
  }

  /**
   * Get disaster zone transactions
   */
  async getDisasterTransactions(id, params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const endpoint = `/disasters/${id}/transactions${queryString ? `?${queryString}` : ''}`
    return this.request(endpoint)
  }

  // ==============================================
  // VENDOR API ENDPOINTS
  // ==============================================

  /**
   * Get all vendors
   */
  async getVendors(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const endpoint = `/vendors${queryString ? `?${queryString}` : ''}`
    return this.request(endpoint)
  }

  /**
   * Get vendor by address
   */
  async getVendor(address) {
    return this.request(`/vendors/${address}`)
  }

  /**
   * Register new vendor
   */
  async registerVendor(data) {
    return this.request('/vendors', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Verify vendor
   */
  async verifyVendor(address, zoneId) {
    return this.request(`/vendors/${address}/verify`, {
      method: 'POST',
      body: JSON.stringify({ zoneId }),
    })
  }

  /**
   * Get vendors for a specific disaster zone
   */
  async getZoneVendors(zoneId) {
    return this.request(`/disasters/${zoneId}/vendors`)
  }

  // ==============================================
  // VOUCHER API ENDPOINTS
  // ==============================================

  /**
   * Get all vouchers
   */
  async getVouchers(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const endpoint = `/vouchers${queryString ? `?${queryString}` : ''}`
    return this.request(endpoint)
  }

  /**
   * Get voucher by ID
   */
  async getVoucher(id) {
    return this.request(`/vouchers/${id}`)
  }

  /**
   * Issue new voucher
   */
  async issueVoucher(data) {
    return this.request('/vouchers', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Redeem voucher
   */
  async redeemVoucher(id, data) {
    return this.request(`/vouchers/${id}/redeem`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Get user vouchers
   */
  async getUserVouchers(address) {
    return this.request(`/users/${address}/vouchers`)
  }

  // ==============================================
  // TRANSACTION API ENDPOINTS
  // ==============================================

  /**
   * Get all transactions
   */
  async getTransactions(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const endpoint = `/transactions${queryString ? `?${queryString}` : ''}`
    return this.request(endpoint)
  }

  /**
   * Get transaction by hash
   */
  async getTransaction(hash) {
    return this.request(`/transactions/${hash}`)
  }

  /**
   * Record new transaction
   */
  async recordTransaction(data) {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // ==============================================
  // ANALYTICS API ENDPOINTS
  // ==============================================

  /**
   * Get dashboard analytics
   */
  async getDashboardStats() {
    return this.request('/analytics/dashboard')
  }

  /**
   * Get funding statistics
   */
  async getFundingStats(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const endpoint = `/analytics/funding${queryString ? `?${queryString}` : ''}`
    return this.request(endpoint)
  }

  /**
   * Get geographic distribution data
   */
  async getGeographicStats() {
    return this.request('/analytics/geographic')
  }

  /**
   * Get impact metrics
   */
  async getImpactMetrics(zoneId = null) {
    const endpoint = zoneId ? `/analytics/impact/${zoneId}` : '/analytics/impact'
    return this.request(endpoint)
  }

  // ==============================================
  // NOTIFICATION API ENDPOINTS
  // ==============================================

  /**
   * Get user notifications
   */
  async getNotifications(address) {
    return this.request(`/notifications/${address}`)
  }

  /**
   * Mark notification as read
   */
  async markNotificationRead(id) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PATCH',
    })
  }

  /**
   * Subscribe to notifications
   */
  async subscribeToNotifications(data) {
    return this.request('/notifications/subscribe', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // ==============================================
  // AUTH API ENDPOINTS
  // ==============================================

  /**
   * Authenticate user with wallet signature
   */
  async authenticate(data) {
    return this.request('/auth/wallet', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Refresh authentication token
   */
  async refreshToken() {
    return this.request('/auth/refresh', {
      method: 'POST',
    })
  }

  /**
   * Get user profile
   */
  async getUserProfile(address) {
    return this.request(`/users/${address}`)
  }

  /**
   * Update user profile
   */
  async updateUserProfile(address, data) {
    return this.request(`/users/${address}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }
}

// Create and export singleton instance
const apiService = new ApiService()
export default apiService

// Export individual methods for convenience
export const {
  getDisasterZones,
  getDisasterZone,
  createDisasterZone,
  updateDisasterStatus,
  getDisasterStats,
  getDisasterTransactions,
  getVendors,
  getVendor,
  registerVendor,
  verifyVendor,
  getZoneVendors,
  getVouchers,
  getVoucher,
  issueVoucher,
  redeemVoucher,
  getUserVouchers,
  getTransactions,
  getTransaction,
  recordTransaction,
  getDashboardStats,
  getFundingStats,
  getGeographicStats,
  getImpactMetrics,
  getNotifications,
  markNotificationRead,
  subscribeToNotifications,
  authenticate,
  refreshToken,
  getUserProfile,
  updateUserProfile,
} = apiService

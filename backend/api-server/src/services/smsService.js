const twilio = require('twilio');

class SMSService {
  constructor() {
    this.client = null;
    this.initializeClient();
  }

  initializeClient() {
    try {
      // Initialize Twilio client
      const accountSid = process.env.TWILIO_ACCOUNT_SID || 'demo_account_sid';
      const authToken = process.env.TWILIO_AUTH_TOKEN || 'demo_auth_token';
      const fromNumber = process.env.TWILIO_FROM_NUMBER || '+1234567890';

      if (process.env.NODE_ENV === 'production' && accountSid.startsWith('demo_')) {
        throw new Error('Production Twilio credentials not configured');
      }

      this.client = twilio(accountSid, authToken);
      this.fromNumber = fromNumber;
      
      console.log('SMS service initialized');
    } catch (error) {
      console.log('SMS service running in mock mode:', error.message);
      this.client = null;
    }
  }

  async sendSMS(to, message, type = 'general') {
    try {
      if (!this.client) {
        // Mock SMS sending in development
        console.log('📱 Mock SMS Sent:');
        console.log(`To: ${to}`);
        console.log(`Type: ${type}`);
        console.log(`Message: ${message}`);
        
        return {
          success: true,
          sid: `mock_${Date.now()}`,
          status: 'delivered',
          mock: true
        };
      }

      const messageOptions = {
        body: message,
        from: this.fromNumber,
        to: to
      };

      const result = await this.client.messages.create(messageOptions);
      
      console.log('SMS sent successfully:', result.sid);
      
      return {
        success: true,
        sid: result.sid,
        status: result.status,
        mock: false
      };
    } catch (error) {
      console.error('SMS sending failed:', error);
      
      return {
        success: false,
        error: error.message,
        mock: !this.client
      };
    }
  }

  async sendBulkSMS(recipients, message, type = 'general') {
    const results = [];
    
    for (const recipient of recipients) {
      try {
        const result = await this.sendSMS(recipient.phone, message, type);
        results.push({
          recipient: recipient.phone,
          success: result.success,
          sid: result.sid,
          error: result.error
        });
      } catch (error) {
        results.push({
          recipient: recipient.phone,
          success: false,
          error: error.message
        });
      }
    }
    
    return {
      total: recipients.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results: results
    };
  }

  async sendDisasterAlert(recipients, disasterDetails) {
    const message = `🚨 DISASTER ALERT: ${disasterDetails.name}. Location: ${disasterDetails.latitude}, ${disasterDetails.longitude}. Radius: ${disasterDetails.radius}km. Check relief portal for updates.`;
    
    return await this.sendBulkSMS(recipients, message, 'disaster_alert');
  }

  async sendVoucherNotification(recipient, voucherDetails) {
    const message = `🎫 New voucher available! ID: ${voucherDetails.id}, Category: ${voucherDetails.category}, Amount: $${voucherDetails.amount}. Valid until: ${new Date(voucherDetails.expiresAt).toLocaleDateString()}`;
    
    return await this.sendSMS(recipient.phone, message, 'voucher_notification');
  }

  async sendEmergencyAlert(recipients, alertDetails) {
    const message = `🚨 EMERGENCY ALERT: ${alertDetails.message}. Location: ${alertDetails.location}. Follow instructions from local authorities. Stay safe!`;
    
    return await this.sendBulkSMS(recipients, message, 'emergency_alert');
  }

  async sendVendorUpdate(recipient, updateDetails) {
    const message = `🏪 Vendor Update: ${updateDetails.type} - ${updateDetails.message}. ${updateDetails.actionRequired ? 'Action required. ' : ''}Check vendor portal.`;
    
    return await this.sendSMS(recipient.phone, message, 'vendor_update');
  }

  async sendFundingUpdate(recipients, fundingDetails) {
    const message = `💰 Funding Update for ${fundingDetails.disasterName}: Raised: $${fundingDetails.totalRaised}, Distributed: $${fundingDetails.totalDistributed}, Available: $${fundingDetails.availableBalance}`;
    
    return await this.sendBulkSMS(recipients, message, 'funding_update');
  }

  async sendOTPCode(phoneNumber, code) {
    const message = `Your Disaster Relief Network verification code is: ${code}. This code expires in 10 minutes. Do not share this code with anyone.`;
    
    return await this.sendSMS(phoneNumber, message, 'otp_verification');
  }

  async sendWelcomeMessage(recipient, userDetails) {
    const message = `Welcome to Disaster Relief Network! Your account has been created successfully. Role: ${userDetails.role}. Visit our portal to get started.`;
    
    return await this.sendSMS(recipient.phone, message, 'welcome');
  }

  async sendAccountVerification(recipient, verificationDetails) {
    const message = `Your Disaster Relief Network account has been verified! You can now access all features. Thank you for joining our relief efforts.`;
    
    return await this.sendSMS(recipient.phone, message, 'account_verification');
  }

  async sendTransactionAlert(recipient, transactionDetails) {
    const message = `Transaction Alert: ${transactionDetails.type} of $${transactionDetails.amount} ${transactionDetails.status}. TX: ${transactionDetails.hash.substring(0, 10)}...`;
    
    return await this.sendSMS(recipient.phone, message, 'transaction_alert');
  }

  // Health check method
  async healthCheck() {
    try {
      if (!this.client) {
        return {
          status: 'healthy',
          mode: 'mock',
          message: 'SMS service running in mock mode'
        };
      }

      // Check Twilio account status
      const account = await this.client.api.accounts(this.client.accountSid).fetch();
      
      return {
        status: 'healthy',
        mode: 'live',
        message: 'SMS service connected successfully',
        accountStatus: account.status
      };
    } catch (error) {
      return {
        status: 'error',
        mode: 'unknown',
        message: error.message
      };
    }
  }

  // Validate phone number format
  validatePhoneNumber(phoneNumber) {
    // Basic international phone number validation
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
  }

  // Format phone number for sending
  formatPhoneNumber(phoneNumber) {
    // Remove all non-digit characters except +
    let formatted = phoneNumber.replace(/[^\d+]/g, '');
    
    // Add + if not present
    if (!formatted.startsWith('+')) {
      formatted = '+1' + formatted; // Default to US if no country code
    }
    
    return formatted;
  }

  // Get message delivery status
  async getMessageStatus(messageSid) {
    try {
      if (!this.client) {
        return {
          status: 'mock',
          message: 'Mock message status'
        };
      }

      const message = await this.client.messages(messageSid).fetch();
      
      return {
        status: message.status,
        errorCode: message.errorCode,
        errorMessage: message.errorMessage,
        direction: message.direction,
        dateCreated: message.dateCreated,
        dateSent: message.dateSent,
        dateUpdated: message.dateUpdated
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message
      };
    }
  }
}

module.exports = new SMSService();

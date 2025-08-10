const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Initialize email transporter (currently configured for development)
    // In production, you would configure this with actual email service credentials
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER || 'demo@relief.network',
        pass: process.env.EMAIL_PASS || 'demo123'
      }
    });

    // For development, use ethereal email for testing
    if (process.env.NODE_ENV === 'development') {
      this.setupTestAccount();
    }
  }

  async setupTestAccount() {
    try {
      // Create test account for development
      const testAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      console.log('Email service configured with test account:', testAccount.user);
    } catch (error) {
      console.log('Using mock email service for development');
      this.transporter = null;
    }
  }

  async sendNotification(to, subject, content, type = 'general') {
    try {
      if (!this.transporter) {
        // Mock email sending in development
        console.log('📧 Mock Email Sent:');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Type: ${type}`);
        console.log(`Content: ${content}`);
        
        return {
          success: true,
          messageId: `mock_${Date.now()}`,
          preview: `Mock email sent to ${to}`
        };
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM || '"Disaster Relief System" <noreply@relief.network>',
        to: to,
        subject: subject,
        html: this.formatEmailContent(content, type)
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      console.log('Email sent successfully:', info.messageId);
      
      return {
        success: true,
        messageId: info.messageId,
        preview: nodemailer.getTestMessageUrl(info)
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  formatEmailContent(content, type) {
    const templates = {
      disaster_alert: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
            <h1>🚨 Disaster Alert</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            ${content}
          </div>
          <div style="padding: 10px; text-align: center; color: #666; font-size: 12px;">
            Disaster Relief Network - Automated Alert System
          </div>
        </div>
      `,
      funding_update: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #059669; color: white; padding: 20px; text-align: center;">
            <h1>💰 Funding Update</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            ${content}
          </div>
          <div style="padding: 10px; text-align: center; color: #666; font-size: 12px;">
            Disaster Relief Network - Transparency Portal
          </div>
        </div>
      `,
      voucher_notification: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2563eb; color: white; padding: 20px; text-align: center;">
            <h1>🎫 Voucher Notification</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            ${content}
          </div>
          <div style="padding: 10px; text-align: center; color: #666; font-size: 12px;">
            Disaster Relief Network - Victim Support System
          </div>
        </div>
      `,
      vendor_update: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #7c3aed; color: white; padding: 20px; text-align: center;">
            <h1>🏪 Vendor Update</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            ${content}
          </div>
          <div style="padding: 10px; text-align: center; color: #666; font-size: 12px;">
            Disaster Relief Network - Vendor Portal
          </div>
        </div>
      `,
      general: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #374151; color: white; padding: 20px; text-align: center;">
            <h1>📢 Disaster Relief Network</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            ${content}
          </div>
          <div style="padding: 10px; text-align: center; color: #666; font-size: 12px;">
            Disaster Relief Network - Official Communication
          </div>
        </div>
      `
    };

    return templates[type] || templates.general;
  }

  async sendBulkNotifications(recipients, subject, content, type = 'general') {
    const results = [];
    
    for (const recipient of recipients) {
      try {
        const result = await this.sendNotification(recipient.email, subject, content, type);
        results.push({
          recipient: recipient.email,
          success: result.success,
          messageId: result.messageId,
          error: result.error
        });
      } catch (error) {
        results.push({
          recipient: recipient.email,
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
    const subject = `🚨 Disaster Alert: ${disasterDetails.name}`;
    const content = `
      <h2>New Disaster Zone Activated</h2>
      <p><strong>Location:</strong> ${disasterDetails.name}</p>
      <p><strong>Coordinates:</strong> ${disasterDetails.latitude}, ${disasterDetails.longitude}</p>
      <p><strong>Affected Radius:</strong> ${disasterDetails.radius} km</p>
      <p><strong>Initial Funding:</strong> $${disasterDetails.initialFunding}</p>
      <p><strong>Status:</strong> ${disasterDetails.status}</p>
      <p>Please check the disaster relief portal for more information and response coordination.</p>
    `;
    
    return await this.sendBulkNotifications(recipients, subject, content, 'disaster_alert');
  }

  async sendVoucherNotification(recipient, voucherDetails) {
    const subject = `🎫 New Voucher Available: ${voucherDetails.category}`;
    const content = `
      <h2>Relief Voucher Issued</h2>
      <p><strong>Voucher ID:</strong> ${voucherDetails.id}</p>
      <p><strong>Category:</strong> ${voucherDetails.category}</p>
      <p><strong>Amount:</strong> $${voucherDetails.amount}</p>
      <p><strong>Valid Until:</strong> ${new Date(voucherDetails.expiresAt).toLocaleDateString()}</p>
      <p><strong>Vendor:</strong> ${voucherDetails.vendorName}</p>
      <p>Use this voucher at authorized vendors to receive essential supplies.</p>
    `;
    
    return await this.sendNotification(recipient.email, subject, content, 'voucher_notification');
  }

  async sendFundingUpdate(recipients, fundingDetails) {
    const subject = `💰 Funding Update: ${fundingDetails.disasterName}`;
    const content = `
      <h2>Funding Status Update</h2>
      <p><strong>Disaster Zone:</strong> ${fundingDetails.disasterName}</p>
      <p><strong>Total Raised:</strong> $${fundingDetails.totalRaised}</p>
      <p><strong>Total Distributed:</strong> $${fundingDetails.totalDistributed}</p>
      <p><strong>Available Balance:</strong> $${fundingDetails.availableBalance}</p>
      <p><strong>Active Vouchers:</strong> ${fundingDetails.activeVouchers}</p>
      <p>Thank you for your continued support in disaster relief efforts.</p>
    `;
    
    return await this.sendBulkNotifications(recipients, subject, content, 'funding_update');
  }

  async sendVendorUpdate(recipient, updateDetails) {
    const subject = `🏪 Vendor Portal Update: ${updateDetails.type}`;
    const content = `
      <h2>Vendor Account Update</h2>
      <p><strong>Update Type:</strong> ${updateDetails.type}</p>
      <p><strong>Details:</strong> ${updateDetails.message}</p>
      <p><strong>Action Required:</strong> ${updateDetails.actionRequired ? 'Yes' : 'No'}</p>
      ${updateDetails.actionRequired ? `<p><strong>Required Action:</strong> ${updateDetails.requiredAction}</p>` : ''}
      <p>Please log in to your vendor portal for more information.</p>
    `;
    
    return await this.sendNotification(recipient.email, subject, content, 'vendor_update');
  }

  // Health check method
  async healthCheck() {
    try {
      if (!this.transporter) {
        return {
          status: 'healthy',
          mode: 'mock',
          message: 'Email service running in mock mode'
        };
      }

      await this.transporter.verify();
      return {
        status: 'healthy',
        mode: 'live',
        message: 'Email service connected successfully'
      };
    } catch (error) {
      return {
        status: 'error',
        mode: 'unknown',
        message: error.message
      };
    }
  }
}

module.exports = new EmailService();

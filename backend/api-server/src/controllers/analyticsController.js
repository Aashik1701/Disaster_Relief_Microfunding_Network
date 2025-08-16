const dataService = require('../services/dataService');
const { validationResult } = require('express-validator');

class AnalyticsController {
  // Dashboard analytics for different user roles
  async getDashboardStats(req, res) {
    try {
      const userRole = req.user.role;
      let stats = {};

      switch (userRole) {
        case 'admin':
          stats = await this.getAdminDashboardStats();
          break;
        case 'government':
          stats = await this.getGovernmentDashboardStats();
          break;
        case 'treasury':
          stats = await this.getTreasuryDashboardStats();
          break;
        case 'vendor':
          stats = await this.getVendorDashboardStats(req.user.walletAddress);
          break;
        case 'victim':
          stats = await this.getVictimDashboardStats(req.user.walletAddress);
          break;
        case 'donor':
          stats = await this.getDonorDashboardStats(req.user.walletAddress);
          break;
        default:
          stats = await this.getPublicDashboardStats();
      }

      res.json({
        success: true,
        data: {
          role: userRole,
          stats,
          timestamp: new Date()
        }
      });
    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Global funding statistics
  async getFundingStats(req, res) {
    try {
      const { period = 'all', zoneId } = req.query;
      
      const stats = zoneId 
        ? await dataService.getDisasterStats(parseInt(zoneId))
        : await dataService.getGlobalStats();

      // Add transaction trends
      const transactionTrends = await dataService.getTransactionStatsByPeriod('day', 30);
      
      res.json({
        success: true,
        data: {
          ...stats,
          trends: transactionTrends,
          period,
          generatedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Funding stats error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Geographic distribution of aid
  async getGeographicStats(req, res) {
    try {
      const disasters = await dataService.getDisasters({ limit: 100 });
      
      const geoStats = disasters.map(disaster => ({
        zoneId: disaster.zoneId,
        name: disaster.name,
        location: {
          latitude: disaster.latitude,
          longitude: disaster.longitude,
          radius: disaster.radius
        },
        funding: {
          initial: disaster.initialFunding,
          current: disaster.currentFunding,
          spent: disaster.totalSpent
        },
        status: disaster.status,
        metrics: {
          vendorCount: disaster.vendors ? disaster.vendors.length : 0,
          voucherCount: disaster.vouchers ? disaster.vouchers.length : 0,
          transactionCount: disaster.transactions ? disaster.transactions.length : 0
        }
      }));

      res.json({
        success: true,
        data: {
          zones: geoStats,
          summary: {
            totalZones: geoStats.length,
            activeZones: geoStats.filter(z => z.status === 'active').length,
            totalFunding: geoStats.reduce((sum, z) => sum + z.funding.initial, 0),
            totalSpent: geoStats.reduce((sum, z) => sum + z.funding.spent, 0)
          }
        }
      });
    } catch (error) {
      console.error('Geographic stats error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Impact metrics for specific zone or global
  async getImpactMetrics(req, res) {
    try {
      const { zoneId } = req.params;
      
      let metrics;
      if (zoneId) {
        // Zone-specific impact
        const disaster = await dataService.getDisasterById(parseInt(zoneId));
        if (!disaster) {
          return res.status(404).json({
            success: false,
            error: 'Disaster zone not found'
          });
        }
        
        metrics = await this.calculateZoneImpact(disaster);
      } else {
        // Global impact
        metrics = await this.calculateGlobalImpact();
      }

      res.json({
        success: true,
        data: metrics
      });
    } catch (error) {
      console.error('Impact metrics error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // User statistics by role
  async getUserStatsByRole(req, res) {
    try {
      const stats = await dataService.getUserStatsByRole();
      
      const formattedStats = stats.map(stat => ({
        role: stat.role,
        count: parseInt(stat.count),
        percentage: 0 // Will be calculated
      }));

      const total = formattedStats.reduce((sum, stat) => sum + stat.count, 0);
      formattedStats.forEach(stat => {
        stat.percentage = total > 0 ? ((stat.count / total) * 100).toFixed(1) : 0;
      });

      res.json({
        success: true,
        data: {
          roleStats: formattedStats,
          totalUsers: total
        }
      });
    } catch (error) {
      console.error('User stats error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Private helper methods for role-specific dashboard stats
  async getAdminDashboardStats() {
    const [globalStats, userStats, recentTransactions] = await Promise.all([
      dataService.getGlobalStats(),
      dataService.getUserStatsByRole(),
      dataService.getTransactions({ limit: 5 })
    ]);

    return {
      overview: globalStats,
      users: userStats,
      recentActivity: recentTransactions,
      systemHealth: 'healthy'
    };
  }

  async getGovernmentDashboardStats() {
    const [disasters, globalStats] = await Promise.all([
      dataService.getDisasters({ limit: 10 }),
      dataService.getGlobalStats()
    ]);

    return {
      disasters: disasters.map(d => ({
        id: d.zoneId,
        name: d.name,
        status: d.status,
        funding: d.currentFunding,
        location: { latitude: d.latitude, longitude: d.longitude }
      })),
      summary: globalStats,
      pendingApprovals: 0 // Would need to implement approval workflow
    };
  }

  async getTreasuryDashboardStats() {
    const globalStats = await dataService.getGlobalStats();
    const transactionTrends = await dataService.getTransactionStatsByPeriod('day', 7);

    return {
      financial: {
        totalFunding: globalStats.totalFunding,
        totalSpent: globalStats.totalSpent,
        remainingFunds: globalStats.remainingFunds,
        utilizationRate: globalStats.totalFunding > 0 
          ? ((globalStats.totalSpent / globalStats.totalFunding) * 100).toFixed(1)
          : 0
      },
      trends: transactionTrends,
      alerts: [] // Would implement financial alerts
    };
  }

  async getVendorDashboardStats(walletAddress) {
    const [vendor, transactions] = await Promise.all([
      dataService.getVendorByAddress(walletAddress),
      dataService.getTransactions({ vendorAddress: walletAddress, limit: 10 })
    ]);

    if (!vendor) {
      return {
        status: 'not_registered',
        message: 'Vendor not found'
      };
    }

    const totalSales = transactions.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

    return {
      vendor: {
        status: vendor.status,
        disasterZone: vendor.disasterZoneId,
        verificationStatus: vendor.verificationStatus
      },
      sales: {
        total: totalSales,
        transactionCount: transactions.length,
        recentTransactions: transactions.slice(0, 5)
      }
    };
  }

  async getVictimDashboardStats(walletAddress) {
    const vouchers = await dataService.getVouchers(walletAddress);
    
    const activeVouchers = vouchers.filter(v => !v.used && new Date(v.expiryTime) > new Date());
    const totalValue = activeVouchers.reduce((sum, v) => sum + parseFloat(v.amount || 0), 0);

    return {
      vouchers: {
        total: vouchers.length,
        active: activeVouchers.length,
        totalValue,
        recentVouchers: vouchers.slice(0, 5)
      }
    };
  }

  async getDonorDashboardStats(walletAddress) {
    // Note: Would need to implement donation tracking
    return {
      donations: {
        total: 0,
        count: 0,
        impact: {
          vouchersEnabled: 0,
          peopleFed: 0
        }
      },
      message: 'Donation tracking to be implemented'
    };
  }

  async getPublicDashboardStats() {
    const globalStats = await dataService.getGlobalStats();
    
    return {
      public: {
        totalDisasters: globalStats.disasterCount,
        totalAidDistributed: globalStats.totalSpent,
        activeZones: globalStats.disasterCount // Would filter by status
      }
    };
  }

  async calculateZoneImpact(disaster) {
    const transactions = await dataService.getTransactions({ disasterZoneId: disaster.zoneId });
    
    return {
      zoneId: disaster.zoneId,
      name: disaster.name,
      impact: {
        totalAid: disaster.totalSpent,
        transactionCount: transactions.length,
        vendorCount: disaster.vendors ? disaster.vendors.length : 0,
        voucherCount: disaster.vouchers ? disaster.vouchers.length : 0,
        utilizationRate: disaster.initialFunding > 0 
          ? ((disaster.totalSpent / disaster.initialFunding) * 100).toFixed(1)
          : 0
      }
    };
  }

  async calculateGlobalImpact() {
    const globalStats = await dataService.getGlobalStats();
    
    return {
      global: {
        totalFunding: globalStats.totalFunding,
        totalSpent: globalStats.totalSpent,
        disasterZones: globalStats.disasterCount,
        vendors: globalStats.vendorCount,
        vouchers: globalStats.voucherCount,
        transactions: globalStats.transactionCount,
        efficiency: globalStats.totalFunding > 0 
          ? ((globalStats.totalSpent / globalStats.totalFunding) * 100).toFixed(1)
          : 0
      }
    };
  }
}

module.exports = new AnalyticsController();

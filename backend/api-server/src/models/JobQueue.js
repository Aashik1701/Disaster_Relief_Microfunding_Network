const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const JobQueue = sequelize.define('JobQueue', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  job_type: {
    type: DataTypes.ENUM(
      'send_notification', 
      'process_payment', 
      'verify_proof_of_aid', 
      'generate_report', 
      'update_analytics',
      'blockchain_sync',
      'backup_data',
      'cleanup_expired',
      'send_email',
      'send_sms'
    ),
    allowNull: false
  },
  priority: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: -100,
      max: 100
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'retrying'),
    defaultValue: 'pending'
  },
  payload: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      const value = this.getDataValue('payload');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('payload', JSON.stringify(value));
    }
  },
  result: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('result');
      return value ? JSON.parse(value) : null;
    },
    set(value) {
      this.setDataValue('result', value ? JSON.stringify(value) : null);
    }
  },
  attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  max_attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 3,
    validate: {
      min: 1,
      max: 10
    }
  },
  scheduled_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: () => new Date()
  },
  started_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  worker_id: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'job_queue',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['status'] },
    { fields: ['job_type'] },
    { fields: ['priority'] },
    { fields: ['scheduled_at'] },
    { fields: ['created_at'] },
    { fields: ['worker_id'] }
  ],
  scopes: {
    pending: {
      where: {
        status: 'pending',
        scheduled_at: {
          [sequelize.Sequelize.Op.lte]: new Date()
        }
      },
      order: [['priority', 'DESC'], ['created_at', 'ASC']]
    },
    failed: {
      where: {
        status: 'failed'
      }
    },
    processing: {
      where: {
        status: 'processing'
      }
    }
  }
});

// Instance methods
JobQueue.prototype.markAsProcessing = async function(workerId) {
  this.status = 'processing';
  this.started_at = new Date();
  this.worker_id = workerId;
  this.attempts += 1;
  return await this.save();
};

JobQueue.prototype.markAsCompleted = async function(result = null) {
  this.status = 'completed';
  this.completed_at = new Date();
  this.result = result;
  return await this.save();
};

JobQueue.prototype.markAsFailed = async function(error) {
  this.status = 'failed';
  this.completed_at = new Date();
  this.result = {
    error: error.message || error,
    stack: error.stack,
    timestamp: new Date().toISOString()
  };
  return await this.save();
};

JobQueue.prototype.retry = async function(delay = 60000) {
  if (this.attempts >= this.max_attempts) {
    return await this.markAsFailed(new Error('Maximum retry attempts exceeded'));
  }
  
  this.status = 'pending';
  this.scheduled_at = new Date(Date.now() + delay);
  this.worker_id = null;
  this.started_at = null;
  this.completed_at = null;
  return await this.save();
};

JobQueue.prototype.canRetry = function() {
  return this.attempts < this.max_attempts;
};

JobQueue.prototype.getDuration = function() {
  if (!this.started_at) return null;
  const endTime = this.completed_at || new Date();
  return endTime.getTime() - this.started_at.getTime();
};

// Class methods
JobQueue.addJob = async function(jobType, payload, options = {}) {
  const job = await this.create({
    job_type: jobType,
    payload,
    priority: options.priority || 0,
    max_attempts: options.maxAttempts || 3,
    scheduled_at: options.scheduledAt || new Date()
  });
  
  return job;
};

JobQueue.getNextJob = async function(workerId, jobTypes = null) {
  const whereClause = {
    status: 'pending',
    scheduled_at: {
      [sequelize.Sequelize.Op.lte]: new Date()
    }
  };
  
  if (jobTypes && jobTypes.length > 0) {
    whereClause.job_type = {
      [sequelize.Sequelize.Op.in]: jobTypes
    };
  }
  
  const job = await this.findOne({
    where: whereClause,
    order: [['priority', 'DESC'], ['created_at', 'ASC']]
  });
  
  if (job) {
    await job.markAsProcessing(workerId);
  }
  
  return job;
};

JobQueue.getQueueStats = async function() {
  const stats = await this.findAll({
    attributes: [
      'status',
      [sequelize.fn('COUNT', '*'), 'count']
    ],
    group: ['status'],
    raw: true
  });
  
  const result = {
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    retrying: 0
  };
  
  stats.forEach(stat => {
    result[stat.status] = parseInt(stat.count);
  });
  
  return result;
};

JobQueue.cleanupOldJobs = async function(olderThanDays = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
  
  return await this.destroy({
    where: {
      status: ['completed', 'failed'],
      completed_at: {
        [sequelize.Sequelize.Op.lt]: cutoffDate
      }
    }
  });
};

JobQueue.retryFailedJobs = async function(jobType = null, maxAge = 24) {
  const cutoffDate = new Date();
  cutoffDate.setHours(cutoffDate.getHours() - maxAge);
  
  const whereClause = {
    status: 'failed',
    completed_at: {
      [sequelize.Sequelize.Op.gte]: cutoffDate
    }
  };
  
  if (jobType) {
    whereClause.job_type = jobType;
  }
  
  const failedJobs = await this.findAll({
    where: whereClause
  });
  
  let retriedCount = 0;
  for (const job of failedJobs) {
    if (job.canRetry()) {
      await job.retry();
      retriedCount++;
    }
  }
  
  return retriedCount;
};

module.exports = JobQueue;

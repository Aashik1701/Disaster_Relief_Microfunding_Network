const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    // Create Jobs Queue table for background job processing
    await queryInterface.createTable('job_queue', {
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
        comment: 'Higher numbers = higher priority'
      },
      status: {
        type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'retrying'),
        defaultValue: 'pending'
      },
      payload: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'JSON payload for the job'
      },
      result: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Result or error message'
      },
      attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      max_attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 3
      },
      scheduled_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'When the job should be processed'
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
        allowNull: true,
        comment: 'ID of the worker processing this job'
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });

    // Create indexes for Job Queue table
    await queryInterface.addIndex('job_queue', ['status']);
    await queryInterface.addIndex('job_queue', ['job_type']);
    await queryInterface.addIndex('job_queue', ['priority']);
    await queryInterface.addIndex('job_queue', ['scheduled_at']);
    await queryInterface.addIndex('job_queue', ['created_at']);
    await queryInterface.addIndex('job_queue', ['worker_id']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('job_queue');
  }
};

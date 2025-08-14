import mongoose from 'mongoose';

const interfaceLogSchema = new mongoose.Schema({
  interfaceName: {
    type: String,
    required: true,
    index: true
  },
  integrationKey: {
    type: String,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'pending', 'warning'],
    required: true,
    index: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  executionTime: {
    type: Number, // in milliseconds
    default: 0
  },
  recordsProcessed: {
    type: Number,
    default: 0
  },
  errorCode: {
    type: String,
    default: null
  },
  retryCount: {
    type: Number,
    default: 0
  },
  sourceSystem: {
    type: String,
    default: 'SAP SuccessFactors'
  },
  targetSystem: {
    type: String,
    required: true
  },
  batchId: {
    type: String,
    index: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  collection: 'interface_logs'
});

// Compound indexes for better query performance
interfaceLogSchema.index({ timestamp: -1, status: 1 });
interfaceLogSchema.index({ interfaceName: 1, timestamp: -1 });
interfaceLogSchema.index({ integrationKey: 1, status: 1, timestamp: -1 });

// Virtual for success rate calculation
interfaceLogSchema.virtual('isSuccess').get(function() {
  return this.status === 'success';
});

// Static method to get summary statistics
interfaceLogSchema.statics.getSummaryStats = async function(timeRange = '24h') {
  const now = new Date();
  let startDate;
  
  switch (timeRange) {
    case '1h':
      startDate = new Date(now.getTime() - 60 * 60 * 1000);
      break;
    case '24h':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  }

  const pipeline = [
    {
      $match: {
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        totalExecutions: { $sum: 1 },
        successfulExecutions: {
          $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] }
        },
        failedExecutions: {
          $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
        },
        pendingExecutions: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        warningExecutions: {
          $sum: { $cond: [{ $eq: ['$status', 'warning'] }, 1, 0] }
        },
        avgExecutionTime: { $avg: '$executionTime' },
        totalRecordsProcessed: { $sum: '$recordsProcessed' }
      }
    }
  ];

  const [result] = await this.aggregate(pipeline);
  return result || {
    totalExecutions: 0,
    successfulExecutions: 0,
    failedExecutions: 0,
    pendingExecutions: 0,
    warningExecutions: 0,
    avgExecutionTime: 0,
    totalRecordsProcessed: 0
  };
};

// Static method to get trend data
interfaceLogSchema.statics.getTrendData = async function(timeRange = '24h') {
  // This would typically compare with previous period
  // For now, returning mock trend data
  return {
    totalChange: Math.floor(Math.random() * 20) - 10,
    successChange: Math.floor(Math.random() * 15) - 5,
    failureChange: Math.floor(Math.random() * 10) - 5,
    successRateChange: Math.floor(Math.random() * 8) - 4
  };
};

// Static method to get unique interface names
interfaceLogSchema.statics.getUniqueInterfaceNames = async function() {
  return await this.distinct('interfaceName');
};

// Static method to get unique integration keys
interfaceLogSchema.statics.getUniqueIntegrationKeys = async function() {
  return await this.distinct('integrationKey');
};

export default mongoose.model('InterfaceLog', interfaceLogSchema);

import InterfaceLog from '../models/InterfaceLog.js';

// Sample data configurations
const INTERFACE_NAMES = [
  'SAP-SF-Employee-Sync',
  'SAP-SF-Payroll-Integration',
  'SAP-SF-Benefits-Connector',
  'SAP-SF-Performance-Sync',
  'SAP-SF-Learning-Integration',
  'SAP-SF-Recruiting-Sync',
  'SAP-SF-Compensation-Sync',
  'SAP-SF-Time-Tracking',
  'SAP-SF-Organizational-Sync',
  'SAP-SF-Position-Management',
  'Third-Party-HRIS-Sync',
  'Workday-Integration',
  'ADP-Payroll-Connector',
  'BambooHR-Sync',
  'Greenhouse-Recruiting'
];

const INTEGRATION_KEYS = [
  'SF_EMP_001',
  'SF_PAY_002',
  'SF_BEN_003',
  'SF_PERF_004',
  'SF_LEARN_005',
  'SF_REC_006',
  'SF_COMP_007',
  'SF_TIME_008',
  'SF_ORG_009',
  'SF_POS_010',
  'TP_HRIS_011',
  'WD_INT_012',
  'ADP_PAY_013',
  'BAMBOO_014',
  'GH_REC_015'
];

const TARGET_SYSTEMS = [
  'SAP ECP',
  'SAP SuccessFactors',
  'Workday',
  'ADP Workforce',
  'BambooHR',
  'Greenhouse',
  'Oracle HCM',
  'Microsoft Dynamics',
  'Salesforce',
  'ServiceNow HR'
];

const SUCCESS_MESSAGES = [
  'Employee data synchronized successfully',
  'Payroll records processed without errors',
  'Benefits enrollment updated successfully',
  'Performance data imported successfully',
  'Learning records synchronized',
  'Recruiting data processed successfully',
  'Compensation changes applied',
  'Time tracking data updated',
  'Organizational structure synchronized',
  'Position management completed',
  'Bulk import operation successful',
  'Real-time sync completed',
  'Scheduled batch job finished',
  'Data validation passed',
  'Integration test successful'
];

const ERROR_MESSAGES = [
  'Connection timeout to SAP SuccessFactors',
  'Authentication failed - invalid credentials',
  'Data validation error: missing required fields',
  'API rate limit exceeded',
  'Database connection lost during transaction',
  'Invalid employee ID format detected',
  'Duplicate record found in target system',
  'Network connectivity issues',
  'Insufficient permissions for data access',
  'Data transformation failed',
  'Target system maintenance window',
  'SSL certificate validation failed',
  'JSON parsing error in response',
  'Foreign key constraint violation',
  'Maximum retry attempts exceeded'
];

const WARNING_MESSAGES = [
  'Processing slower than expected',
  'Some records skipped due to validation warnings',
  'Partial success - 95% records processed',
  'Performance degradation detected',
  'High memory usage during processing',
  'API response time exceeding SLA',
  'Data quality issues found',
  'Temporary network latency detected',
  'Queue backlog increasing',
  'Cache hit ratio below threshold'
];

const PENDING_MESSAGES = [
  'Queued for processing',
  'Waiting for approval',
  'Scheduled for next batch',
  'Pending data validation',
  'Awaiting system availability',
  'In processing queue',
  'Waiting for dependency completion',
  'Scheduled maintenance pending',
  'User confirmation required',
  'Batch job queued'
];

const ERROR_CODES = [
  'CONN_TIMEOUT',
  'AUTH_FAILED',
  'VALIDATION_ERROR',
  'RATE_LIMIT',
  'DB_CONNECTION_LOST',
  'INVALID_FORMAT',
  'DUPLICATE_RECORD',
  'NETWORK_ERROR',
  'PERMISSION_DENIED',
  'TRANSFORM_FAILED',
  'MAINTENANCE_MODE',
  'SSL_ERROR',
  'PARSE_ERROR',
  'CONSTRAINT_VIOLATION',
  'RETRY_EXCEEDED'
];

// Utility functions
const randomChoice = (array) => array[Math.floor(Math.random() * array.length)];
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

// Generate realistic execution times based on status
const getExecutionTime = (status) => {
  switch (status) {
    case 'success':
      return randomNumber(500, 5000); // 0.5-5 seconds
    case 'failed':
      return randomNumber(100, 30000); // 0.1-30 seconds (can fail fast or timeout)
    case 'warning':
      return randomNumber(2000, 15000); // 2-15 seconds (slower due to issues)
    case 'pending':
      return randomNumber(0, 1000); // 0-1 second (just queued)
    default:
      return randomNumber(500, 5000);
  }
};

// Generate realistic record counts
const getRecordsProcessed = (status) => {
  switch (status) {
    case 'success':
      return randomNumber(1, 10000);
    case 'failed':
      return randomNumber(0, 1000); // Failed early, processed fewer
    case 'warning':
      return randomNumber(500, 8000); // Partial processing
    case 'pending':
      return 0; // Not processed yet
    default:
      return randomNumber(1, 5000);
  }
};

// Generate status based on realistic distribution
const getRandomStatus = () => {
  const rand = Math.random();
  if (rand < 0.75) return 'success'; // 75% success rate
  if (rand < 0.88) return 'failed';  // 13% failure rate
  if (rand < 0.95) return 'warning'; // 7% warning rate
  return 'pending'; // 5% pending
};

// Generate sample data
const generateSampleData = (count = 100000) => { // Increased to 100k records
  const data = [];
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

  for (let i = 0; i < count; i++) {
    const interfaceName = randomChoice(INTERFACE_NAMES);
    const integrationKey = randomChoice(INTEGRATION_KEYS);
    const status = getRandomStatus();
    const timestamp = randomDate(startDate, endDate);
    const executionTime = getExecutionTime(status);
    const recordsProcessed = getRecordsProcessed(status);
    
    let message, errorCode = null;
    
    switch (status) {
      case 'success':
        message = randomChoice(SUCCESS_MESSAGES);
        break;
      case 'failed':
        message = randomChoice(ERROR_MESSAGES);
        errorCode = randomChoice(ERROR_CODES);
        break;
      case 'warning':
        message = randomChoice(WARNING_MESSAGES);
        break;
      case 'pending':
        message = randomChoice(PENDING_MESSAGES);
        break;
    }

    const record = {
      interfaceName,
      integrationKey,
      status,
      message,
      timestamp,
      executionTime,
      recordsProcessed,
      errorCode,
      retryCount: status === 'failed' ? randomNumber(0, 3) : 0,
      sourceSystem: 'SAP SuccessFactors',
      targetSystem: randomChoice(TARGET_SYSTEMS),
      batchId: `BATCH_${timestamp.getFullYear()}${String(timestamp.getMonth() + 1).padStart(2, '0')}${String(timestamp.getDate()).padStart(2, '0')}_${randomNumber(1000, 9999)}`,
      metadata: {
        version: '2.0',
        environment: randomChoice(['PROD', 'TEST', 'DEV']),
        region: randomChoice(['US-EAST', 'US-WEST', 'EU-CENTRAL', 'ASIA-PACIFIC']),
        dataCenter: randomChoice(['DC01', 'DC02', 'DC03']),
        processingNode: `NODE_${randomNumber(1, 10)}`,
        correlationId: `CORR_${Date.now()}_${randomNumber(1000, 9999)}`
      }
    };

    data.push(record);
  }

  return data;
};

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    

    await InterfaceLog.deleteMany({});
    console.log('🗑️  Cleared existing interface logs');
    
    const sampleData = generateSampleData(50000);
    console.log(`📊 Generated ${sampleData.length} sample records`);
    
    const batchSize = 100;
    const batches = [];
    
    for (let i = 0; i < sampleData.length; i += batchSize) {
      batches.push(sampleData.slice(i, i + batchSize));
    }
    
    console.log(`📦 Inserting data in ${batches.length} batches...`);
    
    for (let i = 0; i < batches.length; i++) {
      await InterfaceLog.insertMany(batches[i]);
      console.log(`✅ Inserted batch ${i + 1}/${batches.length}`);
    }
    
    console.log('🎉 Database seeding completed successfully!');
    
    const stats = await InterfaceLog.getSummaryStats('30d');
    console.log('📈 Summary Statistics:');
    console.log(`   Total Executions: ${stats.totalExecutions}`);
    console.log(`   Successful: ${stats.successfulExecutions}`);
    console.log(`   Failed: ${stats.failedExecutions}`);
    console.log(`   Warnings: ${stats.warningExecutions}`);
    console.log(`   Pending: ${stats.pendingExecutions}`);
    console.log(`   Avg Execution Time: ${Math.round(stats.avgExecutionTime)}ms`);
    console.log(`   Total Records Processed: ${stats.totalRecordsProcessed}`);
    
    return {
      success: true,
      recordsInserted: sampleData.length,
      stats
    };
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
};

export const generateAdditionalData = async (count = 1000) => {
  try {
    console.log(`🌱 Generating ${count} additional records...`);
    
    const additionalData = generateSampleData(count);
    await InterfaceLog.insertMany(additionalData);
    
    console.log(`✅ Added ${count} new records to database`);
    return { success: true, recordsAdded: count };
    
  } catch (error) {
    console.error('❌ Failed to generate additional data:', error);
    throw error;
  }
};

export default {
  seedDatabase,
  generateAdditionalData
};

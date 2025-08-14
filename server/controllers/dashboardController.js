import InterfaceLog from '../models/InterfaceLog.js';

export const getDashboardSummary = async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;
    
    console.log(`📊 Fetching dashboard summary for timeRange: ${timeRange}`);
    

    const [summary, trends] = await Promise.all([
      InterfaceLog.getSummaryStats(timeRange),
      InterfaceLog.getTrendData(timeRange)
    ]);
    
    const response = {
      success: true,
      timeRange,
      summary,
      trends,
      lastUpdated: new Date().toISOString()
    };
    
    res.status(200).json(response);
    
  } catch (error) {
    console.error('❌ Error fetching dashboard summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard summary',
      error: error.message
    });
  }
};

export const getInterfaceLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10, // Changed default to 10 per page
      timeRange = '24h',
      status = '',
      interfaceName = '',
      integrationKey = '',
      sortBy = 'timestamp',
      sortOrder = 'desc'
    } = req.query;

    console.log(`📋 Fetching interface logs - Page: ${page}, Limit: ${limit}, TimeRange: ${timeRange}`);

    // Build query filters
    const filters = {};
    
    // Time range filter
    if (timeRange && timeRange !== 'custom') {
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
      
      filters.timestamp = { $gte: startDate };
    }

    // Status filter
    if (status) {
      filters.status = status;
    }

    // Interface name filter
    if (interfaceName) {
      filters.interfaceName = { $regex: interfaceName, $options: 'i' };
    }

    // Integration key filter
    if (integrationKey) {
      filters.integrationKey = { $regex: integrationKey, $options: 'i' };
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    console.log('🔍 Query filters:', filters);
    console.log('📄 Sort:', sortObj);

    // Execute queries in parallel
    const [logs, totalCount] = await Promise.all([
      InterfaceLog.find(filters)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      InterfaceLog.countDocuments(filters)
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    const response = {
      success: true,
      logs,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
        limit: limitNum
      },
      filters: {
        timeRange,
        status,
        interfaceName,
        integrationKey,
        sortBy,
        sortOrder
      },
      lastUpdated: new Date().toISOString()
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('❌ Error fetching interface logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interface logs',
      error: error.message
    });
  }
};

export const getInterfaceNames = async (req, res) => {
  try {
    console.log('📝 Fetching unique interface names');
    
    const interfaceNames = await InterfaceLog.getUniqueInterfaceNames();
    
    res.status(200).json({
      success: true,
      interfaceNames,
      count: interfaceNames.length
    });

  } catch (error) {
    console.error('❌ Error fetching interface names:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interface names',
      error: error.message
    });
  }
};

export const getIntegrationKeys = async (req, res) => {
  try {
    console.log('🔑 Fetching unique integration keys');
    
    const integrationKeys = await InterfaceLog.getUniqueIntegrationKeys();
    
    res.status(200).json({
      success: true,
      integrationKeys,
      count: integrationKeys.length
    });

  } catch (error) {
    console.error('❌ Error fetching integration keys:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch integration keys',
      error: error.message
    });
  }
};

export const getRealTimeMetrics = async (req, res) => {
  try {
    console.log('⚡ Fetching real-time metrics');
    
    // Get last 5 minutes of data for real-time view
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const recentLogs = await InterfaceLog.find({
      timestamp: { $gte: fiveMinutesAgo }
    }).sort({ timestamp: -1 }).limit(100);

    const statusCounts = await InterfaceLog.aggregate([
      {
        $match: {
          timestamp: { $gte: fiveMinutesAgo }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const response = {
      success: true,
      recentLogs,
      statusCounts,
      lastUpdated: new Date().toISOString(),
      timeWindow: '5 minutes'
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('❌ Error fetching real-time metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch real-time metrics',
      error: error.message
    });
  }
};

export const getPerformanceMetrics = async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;
    
    console.log(`⚡ Fetching performance metrics for timeRange: ${timeRange}`);
    
    // Build time filter
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

    const performanceData = await InterfaceLog.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            hour: { $hour: '$timestamp' },
            interface: '$interfaceName'
          },
          avgExecutionTime: { $avg: '$executionTime' },
          maxExecutionTime: { $max: '$executionTime' },
          minExecutionTime: { $min: '$executionTime' },
          totalRecords: { $sum: '$recordsProcessed' },
          executionCount: { $sum: 1 },
          successCount: {
            $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] }
          },
          failureCount: {
            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { '_id.hour': 1 }
      }
    ]);

    const response = {
      success: true,
      timeRange,
      performanceData,
      lastUpdated: new Date().toISOString()
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('❌ Error fetching performance metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch performance metrics',
      error: error.message
    });
  }
};

export const getHealthCheck = async (req, res) => {
  try {
    // Check database connectivity
    const dbStatus = await InterfaceLog.countDocuments();
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        totalRecords: dbStatus
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: '1.0.0'
    };

    res.status(200).json(health);

  } catch (error) {
    console.error('❌ Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
};

export default {
  getDashboardSummary,
  getInterfaceLogs,
  getInterfaceNames,
  getIntegrationKeys,
  getRealTimeMetrics,
  getPerformanceMetrics,
  getHealthCheck
};

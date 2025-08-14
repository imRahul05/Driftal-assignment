import React, { useMemo } from 'react';

const Home = ({ data, timeRange, onRefresh, loading }) => {
  // Calculate metrics from data
  const metrics = useMemo(() => {
    if (!data) return null;

    const { summary = {}, trends = {} } = data;
    
    return {
      total: {
        value: summary.totalExecutions || 0,
        change: trends.totalChange || 0,
        trend: trends.totalTrend || 'stable'
      },
      success: {
        value: summary.successfulExecutions || 0,
        change: trends.successChange || 0,
        trend: trends.successTrend || 'stable'
      },
      failures: {
        value: summary.failedExecutions || 0,
        change: trends.failureChange || 0,
        trend: trends.failureTrend || 'stable'
      },
      successRate: {
        value: summary.successRate || 0,
        change: trends.successRateChange || 0,
        trend: trends.successRateTrend || 'stable'
      }
    };
  }, [data]);

  // Determine overall system status
  const systemStatus = useMemo(() => {
    if (!metrics) return 'unknown';
    if (metrics.successRate.value >= 95) return 'healthy';
    if (metrics.successRate.value >= 90) return 'warning';
    return 'critical';
  }, [metrics]);

  const formatTimeRange = (range) => {
    const ranges = {
      '1h': 'Last Hour',
      '24h': 'Last 24 Hours',
      '7d': 'Last 7 Days',
      '30d': 'Last 30 Days',
      'custom': 'Custom Range'
    };
    return ranges[range] || range;
  };

  const formatTrend = (change, trend) => {
    const symbol = trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→';
    const prefix = change > 0 ? '+' : '';
    return `${symbol} ${prefix}${change}%`;
  };

  if (loading && !data) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0 flex items-center gap-3">
          📊 Dashboard Overview - {formatTimeRange(timeRange)}
        </h2>
        
        <button
          onClick={onRefresh}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
          🔄 Refresh
        </button>
      </div>

      {/* System Status Indicator */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-3 h-3 rounded-full ${
          systemStatus === 'healthy' ? 'bg-green-500 animate-pulse' :
          systemStatus === 'warning' ? 'bg-yellow-500' :
          'bg-red-500'
        }`}></div>
        <span className={`text-sm font-medium ${
          systemStatus === 'healthy' ? 'text-green-700' :
          systemStatus === 'warning' ? 'text-yellow-700' :
          'text-red-700'
        }`}>
          System Status: {systemStatus.charAt(0).toUpperCase() + systemStatus.slice(1)}
        </span>
      </div>

      {/* Metrics Grid */}
      {metrics ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Total Executions */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total Executions</h3>
              <span className="text-2xl">📈</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {metrics.total.value.toLocaleString()}
            </div>
            <div className={`text-sm font-medium ${
              metrics.total.trend === 'up' ? 'text-green-600' :
              metrics.total.trend === 'down' ? 'text-red-600' :
              'text-gray-500'
            }`}>
              {formatTrend(metrics.total.change, metrics.total.trend)}
            </div>
          </div>

          {/* Successful Executions */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-green-700">Successful</h3>
              <span className="text-2xl">✅</span>
            </div>
            <div className="text-3xl font-bold text-green-800 mb-2">
              {metrics.success.value.toLocaleString()}
            </div>
            <div className={`text-sm font-medium ${
              metrics.success.trend === 'up' ? 'text-green-600' :
              metrics.success.trend === 'down' ? 'text-red-600' :
              'text-gray-500'
            }`}>
              {formatTrend(metrics.success.change, metrics.success.trend)}
            </div>
          </div>

          {/* Failed Executions */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-red-700">Failed</h3>
              <span className="text-2xl">❌</span>
            </div>
            <div className="text-3xl font-bold text-red-800 mb-2">
              {metrics.failures.value.toLocaleString()}
            </div>
            <div className={`text-sm font-medium ${
              metrics.failures.trend === 'down' ? 'text-green-600' :
              metrics.failures.trend === 'up' ? 'text-red-600' :
              'text-gray-500'
            }`}>
              {formatTrend(metrics.failures.change, metrics.failures.trend)}
            </div>
          </div>

          {/* Success Rate */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-blue-700">Success Rate</h3>
              <span className="text-2xl">📊</span>
            </div>
            <div className="text-3xl font-bold text-blue-800 mb-2">
              {metrics.successRate.value.toFixed(1)}%
            </div>
            <div className={`text-sm font-medium ${
              metrics.successRate.trend === 'up' ? 'text-green-600' :
              metrics.successRate.trend === 'down' ? 'text-red-600' :
              'text-gray-500'
            }`}>
              {formatTrend(metrics.successRate.change, metrics.successRate.trend)}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-gray-100 rounded-xl p-6 text-center">
            <div className="text-gray-500 text-lg">📊</div>
            <div className="text-gray-600 mt-2">No data available</div>
          </div>
          <div className="bg-gray-100 rounded-xl p-6 text-center">
            <div className="text-gray-500 text-lg">✅</div>
            <div className="text-gray-600 mt-2">No data available</div>
          </div>
          <div className="bg-gray-100 rounded-xl p-6 text-center">
            <div className="text-gray-500 text-lg">❌</div>
            <div className="text-gray-600 mt-2">No data available</div>
          </div>
          <div className="bg-gray-100 rounded-xl p-6 text-center">
            <div className="text-gray-500 text-lg">📈</div>
            <div className="text-gray-600 mt-2">No data available</div>
          </div>
        </div>
      )}

      {/* Chart Section */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
        <div className="h-64 flex items-center justify-center bg-white rounded-lg border border-gray-200">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">📈</div>
            <div className="text-lg font-medium">Chart Coming Soon</div>
            <div className="text-sm">Performance visualization will be displayed here</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

import React, { useState, useEffect, useMemo } from 'react';
import apiService from '../../api/api';

const Filters = ({ filters, onFiltersChange, timeRange }) => {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [interfaceNames, setInterfaceNames] = useState([]);
  const [integrationKeys, setIntegrationKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Load filter options
  useEffect(() => {
    const loadFilterOptions = async () => {
      setLoading(true);
      try {
        const [names, keys] = await Promise.all([
          apiService.getInterfaceNames(),
          apiService.getIntegrationKeys()
        ]);
        
        setInterfaceNames(Array.isArray(names) ? names : []);
        setIntegrationKeys(Array.isArray(keys) ? keys : []);
      } catch (error) {
        console.error('Failed to load filter options:', error);
        setInterfaceNames([]);
        setIntegrationKeys([]);
      } finally {
        setLoading(false);
      }
    };

    loadFilterOptions();
  }, []);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    onFiltersChange({ [key]: value });
  };

  // Handle custom date range
  const handleDateRangeChange = (field, value) => {
    const newRange = { ...customDateRange, [field]: value };
    setCustomDateRange(newRange);
    
    if (newRange.startDate && newRange.endDate) {
      onFiltersChange({ 
        customStartDate: newRange.startDate,
        customEndDate: newRange.endDate 
      });
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    onFiltersChange({
      status: '',
      interfaceName: '',
      integrationKey: '',
      sortBy: 'timestamp',
      sortOrder: 'desc'
    });
    setCustomDateRange({ startDate: '', endDate: '' });
  };

  // Apply preset filters
  const applyPresetFilter = (preset) => {
    const presets = {
      'errors-only': { status: 'failed' },
      'recent-success': { status: 'success', sortBy: 'timestamp', sortOrder: 'desc' },
      'high-volume': { sortBy: 'executionCount', sortOrder: 'desc' },
      '24h': { timeRange: 'Last 24 hours' },
      '7d': { timeRange: 'Last 7 days' },
      '30d': { timeRange: 'Last 30 days' },
      '90d': { timeRange: 'Last 90 days' }
    };
    
    if (presets[preset]) {
      onFiltersChange(presets[preset]);
    }
  };

  // Get active filters for display
  const activeFilters = useMemo(() => {
    const active = [];
    
    if (filters.status) {
      active.push({ key: 'status', label: 'Status', value: filters.status });
    }
    if (filters.interfaceName) {
      active.push({ key: 'interfaceName', label: 'Interface', value: filters.interfaceName });
    }
    if (filters.integrationKey) {
      active.push({ key: 'integrationKey', label: 'Integration Key', value: filters.integrationKey });
    }
    if (customDateRange.startDate && customDateRange.endDate) {
      active.push({ key: 'dateRange', label: 'Date Range', value: `${customDateRange.startDate} to ${customDateRange.endDate}` });
    }
    
    return active;
  }, [filters, customDateRange]);

  // Remove specific filter
  const removeFilter = (key) => {
    if (key === 'dateRange') {
      setCustomDateRange({ startDate: '', endDate: '' });
      onFiltersChange({ customStartDate: '', customEndDate: '' });
    } else {
      handleFilterChange(key, '');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
        🔍 Filters
      </h3>

      {/* Time Range Quick Filters */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Time Range
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => applyPresetFilter('24h')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              timeRange === 'Last 24 hours' 
                ? 'bg-blue-100 border border-blue-300 text-blue-700' 
                : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Last 24 Hours
          </button>
          <button
            onClick={() => applyPresetFilter('7d')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              timeRange === 'Last 7 days' 
                ? 'bg-blue-100 border border-blue-300 text-blue-700' 
                : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => applyPresetFilter('30d')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              timeRange === 'Last 30 days' 
                ? 'bg-blue-100 border border-blue-300 text-blue-700' 
                : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => applyPresetFilter('90d')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              timeRange === 'Last 90 days' 
                ? 'bg-blue-100 border border-blue-300 text-blue-700' 
                : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Last 90 Days
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="mb-4 min-h-[30px]">
          <div className="flex flex-wrap gap-2">
            {activeFilters.map(filter => (
              <div
                key={filter.key}
                className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 text-blue-700 text-sm font-medium"
              >
                <span className="text-xs">{filter.label}:</span>
                <span className="truncate max-w-[100px]">{filter.value}</span>
                <button
                  onClick={() => removeFilter(filter.key)}
                  className="text-blue-500 hover:text-blue-700 text-xs ml-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Basic Filters */}
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">All Statuses</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Interface Name
          </label>
          <select
            value={filters.interfaceName || ''}
            onChange={(e) => handleFilterChange('interfaceName', e.target.value)}
            disabled={loading}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:opacity-50"
          >
            <option value="">All Interfaces</option>
            {interfaceNames.map(name => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Integration Key
          </label>
          <select
            value={filters.integrationKey || ''}
            onChange={(e) => handleFilterChange('integrationKey', e.target.value)}
            disabled={loading}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:opacity-50"
          >
            <option value="">All Integration Keys</option>
            {integrationKeys.map(key => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <button
        onClick={() => setAdvancedOpen(!advancedOpen)}
        className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:bg-blue-700 my-4"
      >
        {advancedOpen ? '▼' : '▶'} Advanced Filters
      </button>

      {/* Advanced Filters */}
      <div className={`overflow-hidden transition-all duration-300 ${
        advancedOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Custom Date Range
            </label>
            <div className="grid grid-cols-1 gap-2">
              <input
                type="date"
                value={customDateRange.startDate}
                onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <input
                type="date"
                value={customDateRange.endDate}
                onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy || 'timestamp'}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="timestamp">Timestamp</option>
              <option value="interfaceName">Interface Name</option>
              <option value="status">Status</option>
              <option value="duration">Duration</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Sort Order
            </label>
            <select
              value={filters.sortOrder || 'desc'}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Filter Presets */}
      <div className="mt-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Quick Filters
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => applyPresetFilter('errors-only')}
            className="px-3 py-1 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100 transition-all duration-200"
          >
            Errors Only
          </button>
          <button
            onClick={() => applyPresetFilter('recent-success')}
            className="px-3 py-1 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition-all duration-200"
          >
            Recent Success
          </button>
        </div>
      </div>

      {/* Filter Actions */}
      <div className="flex gap-2 mt-6">
        <button
          onClick={clearAllFilters}
          className="flex-1 bg-red-50 border border-red-200 text-red-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-100 transition-all duration-200"
        >
          Clear All
        </button>
      </div>

      {/* Filter Stats */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
        <div className="space-y-2">
          <div className="flex justify-between text-gray-600 text-sm">
            <span>Active Filters:</span>
            <span className="font-semibold text-gray-800">{activeFilters.length}</span>
          </div>
          <div className="flex justify-between text-gray-600 text-sm">
            <span>Time Range:</span>
            <span className="font-semibold text-gray-800">{timeRange}</span>
          </div>
          {loading && (
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Loading options...</span>
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filters;

import React, { useState, useMemo, useCallback } from 'react';
import PaginationBar from './PaginationBar';

const LogsTable = ({ data, filters, loading, onPageChange, pagination }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: 'timestamp',
    direction: 'desc'
  });

  // Apply local filtering for search term only (server handles pagination & other filters)
  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return { logs: [], total: 0 };

    let filteredLogs = [...data];

    // Apply search filter locally
    if (searchTerm) {
      filteredLogs = filteredLogs.filter(log =>
        Object.values(log).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    return {
      logs: filteredLogs,
      total: pagination ? pagination.totalCount : filteredLogs.length
    };
  }, [data, searchTerm, pagination]);

  // Handle sorting
  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  }, []);

  // Handle status filter (display only - no actual filtering since filters are managed by parent)
  const handleStatusFilter = useCallback((status) => {
    // This could be used to show visual feedback but won't actually change filters
    // since filters are managed by the parent DashboardPage component
    console.log('Status filter clicked:', status);
  }, []);

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  // Get unique statuses for filter buttons
  const uniqueStatuses = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return [...new Set(data.map(log => log.status))];
  }, [data]);

  if (loading && !data) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-lg w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
          📋 Interface Logs
        </h2>
        <div className="text-center py-16 text-gray-500">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Logs Available</h3>
          <p className="text-sm leading-relaxed">
            No interface execution logs found for the current filters.
            <br />
            Try adjusting your search criteria or time range.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
          📋 Interface Logs
        </h2>
        
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 min-w-[200px]"
          />
          
          {uniqueStatuses.map(status => (
            <button
              key={status}
              onClick={() => handleStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border ${
                filters?.status === status
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {!pagination && (
        <div className="mb-4 text-sm text-gray-600">
          Showing {processedData.logs.length} of {data.length} logs
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Table Header */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.5fr_120px_3fr_120px_100px] gap-4 p-5 bg-gray-50 border-b border-gray-200 font-semibold text-gray-900 text-sm uppercase tracking-wide">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => handleSort('interfaceName')}
          >
            Interface Name
            <span className="text-xs">
              {sortConfig.key === 'interfaceName' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '⇅'}
            </span>
          </div>
          <div 
            className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => handleSort('integrationKey')}
          >
            Integration Key
            <span className="text-xs">
              {sortConfig.key === 'integrationKey' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '⇅'}
            </span>
          </div>
          <div 
            className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => handleSort('status')}
          >
            Status
            <span className="text-xs">
              {sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '⇅'}
            </span>
          </div>
          <div 
            className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => handleSort('message')}
          >
            Message
            <span className="text-xs">
              {sortConfig.key === 'message' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '⇅'}
            </span>
          </div>
          <div 
            className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => handleSort('timestamp')}
          >
            Timestamp
            <span className="text-xs">
              {sortConfig.key === 'timestamp' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '⇅'}
            </span>
          </div>
          <div>Actions</div>
        </div>

        {/* Table Body */}
        <div className="max-h-96 overflow-y-auto">
          {processedData.logs.map((log, index) => {
            const { date, time } = formatTimestamp(log.timestamp);
            const isSelected = selectedRow === index;
            
            return (
              <div
                key={log.id || index}
                className={`grid grid-cols-1 lg:grid-cols-[2fr_1.5fr_120px_3fr_120px_100px] gap-4 p-5 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                  isSelected ? 'bg-blue-50 border-blue-200' : ''
                }`}
                onClick={() => setSelectedRow(isSelected ? null : index)}
              >
                <div className="font-medium text-gray-900 truncate" title={log.interfaceName}>
                  {log.interfaceName || 'N/A'}
                </div>
                
                <div className="text-gray-600 font-mono text-sm truncate" title={log.integrationKey}>
                  {log.integrationKey || 'N/A'}
                </div>
                
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    log.status === 'success' 
                      ? 'bg-green-100 text-green-800' 
                      : log.status === 'error' || log.status === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : log.status === 'warning'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {log.status || 'unknown'}
                  </span>
                </div>
                
                <div className="text-gray-700 text-sm truncate" title={log.message}>
                  {log.message || 'No message'}
                </div>
                
                <div className="text-gray-600 text-sm">
                  <div className="font-medium">{date}</div>
                  <div className="text-xs text-gray-500">{time}</div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRow(isSelected ? null : index);
                    }}
                  >
                    {isSelected ? 'Hide' : 'View'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Row Details */}
        {selectedRow !== null && processedData.logs[selectedRow] && (
          <div className="border-t border-gray-200 bg-blue-50 p-6">
            <h4 className="font-semibold text-gray-900 mb-3">Log Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Interface Name:</span>
                <div className="text-gray-900 mt-1">{processedData.logs[selectedRow].interfaceName}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Integration Key:</span>
                <div className="text-gray-900 mt-1 font-mono">{processedData.logs[selectedRow].integrationKey}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <div className="text-gray-900 mt-1">{processedData.logs[selectedRow].status}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Timestamp:</span>
                <div className="text-gray-900 mt-1">{new Date(processedData.logs[selectedRow].timestamp).toLocaleString()}</div>
              </div>
              <div className="md:col-span-2">
                <span className="font-medium text-gray-700">Message:</span>
                <div className="text-gray-900 mt-1 p-3 bg-white rounded border border-gray-200">
                  {processedData.logs[selectedRow].message}
                </div>
              </div>
              {processedData.logs[selectedRow].details && (
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-700">Additional Details:</span>
                  <div className="text-gray-900 mt-1 p-3 bg-white rounded border border-gray-200">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(processedData.logs[selectedRow].details, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && <PaginationBar pagination={pagination} onPageChange={onPageChange} />}
    </div>
  );
};

export default LogsTable;

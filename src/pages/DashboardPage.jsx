import React, { useState, useMemo, useEffect } from 'react';
import Home from '../components/DashBoard/Home';
import LogsTable from '../components/DashBoard/LogsTable';
import Filters from '../components/DashBoard/Filters';
import Notifications from '../components/DashBoard/Notifications';
import Loader from '../components/DashBoard/Loader';
import { Filter, Bell, X, Menu, RefreshCw } from 'lucide-react';
import apiService from '../api/api';

const DashboardPage = () => {
  const [timeRange, setTimeRange] = useState('Last 7 days');
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    interfaceName: '',
    integrationKey: '',
    sortBy: 'timestamp',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [logsData, setLogsData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch logs data with pagination
  const fetchLogsData = async () => {
    setLoading(true);
    try {
      const response = await apiService.getLogs(filters);
      setLogsData(response.logs);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch logs data:', error);
      setLogsData([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchLogsData();
  }, [timeRange, filters.page, filters.status, filters.interfaceName, filters.integrationKey, filters.sortBy, filters.sortOrder]);

  const handleRefresh = () => {
    setRefreshing(true);
    setLoading(true); // Show loader when refreshing
    fetchLogsData().finally(() => {
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    });
  };

  // We're removing the Home component as per the user's request
  
  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    // Reset to first page when any filter changes except page
    if (Object.keys(newFilters).some(key => key !== 'page')) {
      setFilters(prev => ({ 
        ...prev, 
        ...newFilters,
        page: 1 // Reset to first page on filter change
      }));
    } else {
      setFilters(prev => ({ ...prev, ...newFilters }));
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // This will be used when loading is false
  const memoizedLogsTable = useMemo(() => 
    <LogsTable 
      filters={filters} 
      data={logsData} 
      loading={loading}
      pagination={pagination}
      onPageChange={handlePageChange}
    />, 
    [filters, logsData, loading, pagination]
  );

  return (
    <div className="min-h-screen bg-white relative">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Time Range:</span>
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Last 24 hours">Last 24 hours</option>
                <option value="Last 7 days">Last 7 days</option>
                <option value="Last 30 days">Last 30 days</option>
                <option value="Last 90 days">Last 90 days</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Filter Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isFilterOpen || Object.keys(filters).length > 0
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              <Filter size={16} />
              <span>Filters</span>
              {Object.keys(filters).length > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                  {Object.keys(filters).length}
                </span>
              )}
            </button>

            
           
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                refreshing 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-blue-700 active:bg-blue-800'
              }`}
            >
              {refreshing ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Refreshing...</span>
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  <span>Refresh</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Main Content */}
        <main className="flex-1">
          <div className="p-6">
            {/* Logs Table with Loader */}
            <div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                {loading ? (
                  <Loader 
                    type="spinner"
                    size="medium"
                    color="blue"
                    message="Loading data..."
                    subMessage="Please wait while we fetch your logs"
                  />
                ) : (
                  memoizedLogsTable
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Notifications Sidebar */}
        {isSidebarOpen && (
          <>
            {/* Overlay for mobile */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            
            {/* Sidebar */}
            <aside className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg z-50 transition-transform duration-300">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              {/* <div className="h-full overflow-y-auto pb-20">
                <Notifications />
              </div> */}
            </aside>
          </>
        )}

        {/* Filters Slide-out Panel */}
        {isFilterOpen && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30"
              onClick={() => setIsFilterOpen(false)}
            />
            
            {/* Filter Panel */}
            <div className="fixed left-0 top-0 h-full w-96 bg-white border-r border-gray-200 shadow-lg z-40 animate-slide-in">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 60px)" }}>
                <Filters filters={filters} onFiltersChange={handleFiltersChange} timeRange={timeRange} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

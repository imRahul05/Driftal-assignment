// API service for Interface Monitoring Dashboard
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Generic fetch with error handling and caching
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = `${url}_${JSON.stringify(options)}`;
    
    // Check cache first
    if (options.method === 'GET' || !options.method) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Cache GET requests
      if (options.method === 'GET' || !options.method) {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
        });
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Dashboard summary metrics
  async getDashboardSummary(timeRange = '24h') {
    return this.request(`/dashboard/summary?timeRange=${timeRange}`);
  }

  // Get comprehensive dashboard data
  async getDashboardData(timeRange = '24h', filters = {}) {
    try {
      const summary = await this.getDashboardSummary(timeRange);
      const performance = await this.getPerformanceMetrics(timeRange);
      
      return {
        summary: summary.data || summary,
        performance: performance.data || performance,
        trends: summary.trends || {},
        timeRange
      };
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      return null;
    }
  }

  // Get logs with filters and pagination
  async getLogs(filters = {}) {
    try {
      const page = filters.page || 1;
      const limit = filters.limit || 10; // Changed default to 10 per page
      
      // Convert UI-friendly time range to API timeRange format
      let timeRange = filters.timeRange || '24h';
      if (filters.timeRange === 'Last 24 hours') timeRange = '24h';
      else if (filters.timeRange === 'Last 7 days') timeRange = '7d';
      else if (filters.timeRange === 'Last 30 days') timeRange = '30d';
      else if (filters.timeRange === 'Last 90 days') timeRange = '90d';
      
      const response = await this.getInterfaceLogs({
        ...filters,
        page,
        limit,
        timeRange
      });
      
      return {
        logs: response.logs || [],
        pagination: response.pagination || {
          currentPage: page,
          totalPages: 1,
          totalCount: response.logs?.length || 0,
          hasNextPage: false,
          hasPrevPage: false,
          limit
        }
      };
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      return { logs: [], pagination: null };
    }
  }

  // Interface logs with pagination and filtering
  async getInterfaceLogs({
    page = 1,
    limit = 10, // Changed default to 10 per page
    timeRange = '24h',
    status = '',
    interfaceName = '',
    integrationKey = '',
    sortBy = 'timestamp',
    sortOrder = 'desc'
  } = {}) {
    // Convert UI-friendly time range to API timeRange format if it hasn't been converted already
    if (timeRange === 'Last 24 hours') timeRange = '24h';
    else if (timeRange === 'Last 7 days') timeRange = '7d';
    else if (timeRange === 'Last 30 days') timeRange = '30d';
    else if (timeRange === 'Last 90 days') timeRange = '90d';
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      timeRange,
      ...(status && { status }),
      ...(interfaceName && { interfaceName }),
      ...(integrationKey && { integrationKey }),
      sortBy,
      sortOrder,
    });

    return this.request(`/interfaces/logs?${params}`);
  }

  // Get unique interface names for filters
  async getInterfaceNames() {
    try {
      const response = await this.request('/interfaces/names');
      // Handle different response structures - backend returns {success, interfaceNames, count}
      if (response.success && Array.isArray(response.interfaceNames)) {
        return response.interfaceNames;
      }
      // Fallback for other response structures
      return response.interfaceNames || response.data || response || [];
    } catch (error) {
      console.error('Failed to fetch interface names:', error);
      return [];
    }
  }

  // Get unique integration keys for filters
  async getIntegrationKeys() {
    try {
      const response = await this.request('/interfaces/keys');
      // Handle different response structures - backend returns {success, integrationKeys, count}
      if (response.success && Array.isArray(response.integrationKeys)) {
        return response.integrationKeys;
      }
      // Fallback for other response structures
      return response.integrationKeys || response.data || response || [];
    } catch (error) {
      console.error('Failed to fetch integration keys:', error);
      return [];
    }
  }

  // Real-time metrics (for WebSocket fallback)
  async getRealTimeMetrics() {
    return this.request('/dashboard/realtime');
  }

  // Performance metrics
  async getPerformanceMetrics(timeRange = '24h') {
    return this.request(`/dashboard/performance?timeRange=${timeRange}`);
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;

// Export individual methods for easier testing
export const {
  getDashboardSummary,
  getInterfaceLogs,
  getInterfaceNames,
  getIntegrationKeys,
  getRealTimeMetrics,
  getPerformanceMetrics,
  clearCache,
  healthCheck,
} = apiService;
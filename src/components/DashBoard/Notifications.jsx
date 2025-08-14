import React, { useState, useMemo, useEffect } from 'react';

const Notifications = ({ notifications = [], onDismiss }) => {
  const [filter, setFilter] = useState('all');
  const [recentlyAdded, setRecentlyAdded] = useState(new Set());

  // Mock notifications for demo purposes
  const mockNotifications = useMemo(() => [
    {
      id: '1',
      type: 'error',
      title: 'Interface Connection Failed',
      message: 'SAP SuccessFactors connection timeout after 30 seconds',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      interfaceName: 'SF-ECP-Sync',
      actions: ['Retry', 'View Details']
    },
    {
      id: '2',
      type: 'warning',
      title: 'High Failure Rate Detected',
      message: 'Employee data sync showing 15% failure rate in last hour',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      interfaceName: 'Employee-Sync',
      actions: ['Investigate', 'Acknowledge']
    },
    {
      id: '3',
      type: 'success',
      title: 'Batch Process Completed',
      message: '5,000 employee records synchronized successfully',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      interfaceName: 'Bulk-Import',
      actions: ['View Report']
    },
    {
      id: '4',
      type: 'info',
      title: 'Scheduled Maintenance',
      message: 'System maintenance window starts in 2 hours',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      interfaceName: 'System',
      actions: ['View Schedule']
    },
    {
      id: '5',
      type: 'warning',
      title: 'API Rate Limit Approaching',
      message: 'Current usage: 850/1000 requests per hour',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      interfaceName: 'API-Gateway',
      actions: ['View Usage', 'Optimize']
    }
  ], []);

  // Combine prop notifications with mock data
  const allNotifications = useMemo(() => {
    return [...notifications, ...mockNotifications].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
  }, [notifications, mockNotifications]);

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    if (filter === 'all') return allNotifications;
    return allNotifications.filter(notification => notification.type === filter);
  }, [allNotifications, filter]);

  // Handle new notifications
  useEffect(() => {
    const newIds = new Set();
    allNotifications.forEach(notification => {
      const age = Date.now() - new Date(notification.timestamp).getTime();
      if (age < 60000) { // Less than 1 minute old
        newIds.add(notification.id);
      }
    });
    setRecentlyAdded(newIds);

    // Clear "new" status after 5 seconds
    const timer = setTimeout(() => {
      setRecentlyAdded(new Set());
    }, 5000);

    return () => clearTimeout(timer);
  }, [allNotifications]);

  // Get notification icon
  const getNotificationIcon = (type) => {
    const icons = {
      error: '❌',
      warning: '⚠️',
      success: '✅',
      info: 'ℹ️'
    };
    return icons[type] || '📢';
  };

  // Format time ago
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // Handle action click
  const handleActionClick = (notificationId, action) => {
    console.log(`Action "${action}" clicked for notification ${notificationId}`);
    // Implement action handling logic here
  };

  // Clear all notifications
  const handleClearAll = () => {
    if (onDismiss) {
      allNotifications.forEach(notification => {
        onDismiss(notification.id);
      });
    }
  };

  // Get filter counts
  const filterCounts = useMemo(() => {
    const counts = { all: allNotifications.length };
    ['error', 'warning', 'success', 'info'].forEach(type => {
      counts[type] = allNotifications.filter(n => n.type === type).length;
    });
    return counts;
  }, [allNotifications]);

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl max-h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          🔔 Notifications
          <span className={`px-2 py-1 rounded-xl text-xs font-bold min-w-[20px] text-center ${
            allNotifications.length > 0 
              ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white animate-pulse'
              : 'bg-white/20 text-white/60'
          }`}>
            {allNotifications.length}
          </span>
        </h3>
        
        <button
          onClick={handleClearAll}
          disabled={allNotifications.length === 0}
          className="bg-red-500/20 border border-red-500/30 text-red-300 px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear All
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { key: 'all', label: 'All', count: filterCounts.all },
          { key: 'error', label: 'Errors', count: filterCounts.error },
          { key: 'warning', label: 'Warnings', count: filterCounts.warning },
          { key: 'success', label: 'Success', count: filterCounts.success },
          { key: 'info', label: 'Info', count: filterCounts.info }
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 border backdrop-blur-sm ${
              filter === key
                ? 'bg-gradient-to-r from-teal-400 to-teal-600 text-white border-teal-400/30'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 text-white/60">
            <div className="text-4xl mb-4">🔕</div>
            <h4 className="text-lg font-medium text-white mb-2">No Notifications</h4>
            <p className="text-sm leading-relaxed">
              All clear! No notifications to display.
              <br />
              New alerts will appear here as they occur.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const isNew = recentlyAdded.has(notification.id);
            return (
              <div
                key={notification.id}
                className={`border-l-4 rounded-xl p-4 backdrop-blur-sm transition-all duration-300 cursor-pointer hover:translate-x-1 hover:shadow-lg relative overflow-hidden ${
                  notification.type === 'error' 
                    ? 'bg-red-500/15 border-red-500/30 border-l-red-500'
                    : notification.type === 'warning'
                    ? 'bg-yellow-500/15 border-yellow-500/30 border-l-yellow-500'
                    : notification.type === 'success'
                    ? 'bg-green-500/15 border-green-500/30 border-l-green-500'
                    : notification.type === 'info'
                    ? 'bg-blue-500/15 border-blue-500/30 border-l-blue-500'
                    : 'bg-white/10 border-white/20 border-l-white/50'
                } ${
                  isNew ? 'ring-2 ring-white/30' : ''
                }`}
              >
                {/* Shimmer effect for new notifications */}
                {isNew && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
                )}

                {/* Dismiss button */}
                <button
                  onClick={() => onDismiss && onDismiss(notification.id)}
                  className="absolute top-2 right-2 text-white/50 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 z-10"
                >
                  ✕
                </button>

                {/* Notification Header */}
                <div className="flex justify-between items-start mb-2 pr-6">
                  <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                    {notification.title}
                  </h4>
                  <span className="text-white/60 text-xs">
                    {formatTimeAgo(notification.timestamp)}
                  </span>
                </div>

                {/* Notification Message */}
                <p className="text-white/80 text-sm leading-relaxed mb-2">
                  {notification.message}
                </p>

                {/* Actions */}
                {notification.actions && notification.actions.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {notification.actions.map((action, index) => (
                      <button
                        key={action}
                        onClick={() => handleActionClick(notification.id, action)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                          index === 0
                            ? 'bg-gradient-to-r from-teal-400 to-teal-600 text-white hover:from-teal-500 hover:to-teal-700'
                            : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                        }`}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Custom scrollbar styles are handled by Tailwind's scrollbar utilities if you have the plugin */}
      <style jsx>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Notifications;

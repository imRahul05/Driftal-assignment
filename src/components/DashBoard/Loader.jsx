import React from 'react';

const Loader = ({ 
  type = 'spinner', 
  size = 'medium', 
  fullScreen = false, 
  message = 'Loading...',
  subMessage = '',
  color = 'blue'
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-20 h-20'
  };

  const colorClasses = {
    blue: 'border-blue-400',
    teal: 'border-teal-400',
    purple: 'border-purple-400',
    pink: 'border-pink-400',
    white: 'border-white',
    gray: 'border-gray-400'
  };

  // Spinner Loader
  const SpinnerLoader = () => (
    <div className={`${sizeClasses[size]} border-4 border-gray-200 ${colorClasses[color]} border-t-transparent rounded-full animate-spin`}></div>
  );

  // Dots Loader
  const DotsLoader = () => (
    <div className="flex space-x-2">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`w-3 h-3 ${color === 'white' ? 'bg-white' : color === 'gray' ? 'bg-gray-400' : `bg-${color}-400`} rounded-full animate-bounce`}
          style={{ animationDelay: `${index * 0.1}s` }}
        ></div>
      ))}
    </div>
  );

  // Pulse Loader
  const PulseLoader = () => (
    <div className={`${sizeClasses[size]} ${color === 'white' ? 'bg-white' : color === 'gray' ? 'bg-gray-400' : `bg-${color}-400`} rounded-full animate-pulse`}></div>
  );

  // Wave Loader
  const WaveLoader = () => (
    <div className="flex items-end space-x-1">
      {[0, 1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className={`w-2 ${color === 'white' ? 'bg-white' : color === 'gray' ? 'bg-gray-400' : `bg-${color}-400`} rounded-full animate-pulse`}
          style={{ 
            height: '24px',
            animationDelay: `${index * 0.1}s`,
            animationDuration: '1s'
          }}
        ></div>
      ))}
    </div>
  );

  // Progress Bar Loader
  const ProgressLoader = () => (
    <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
      <div className={`h-full ${color === 'white' ? 'bg-white' : color === 'gray' ? 'bg-gray-400' : `bg-${color}-400`} rounded-full animate-pulse`}></div>
    </div>
  );

  // Skeleton Loader
  const SkeletonLoader = () => (
    <div className="space-y-4 w-full max-w-md">
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );

  const renderLoader = () => {
    switch (type) {
      case 'dots': return <DotsLoader />;
      case 'pulse': return <PulseLoader />;
      case 'wave': return <WaveLoader />;
      case 'progress': return <ProgressLoader />;
      case 'skeleton': return <SkeletonLoader />;
      default: return <SpinnerLoader />;
    }
  };

  const containerClasses = fullScreen 
    ? 'flex flex-col items-center justify-center min-h-screen bg-white p-10'
    : 'flex flex-col items-center justify-center min-h-[300px] p-10';

  return (
    <div className={containerClasses}>
      {renderLoader()}
      
      {message && (
        <div className="mt-6 text-center">
          <p className="text-gray-700 text-lg font-medium mb-2 animate-pulse">
            {message}
          </p>
          {subMessage && (
            <p className="text-gray-500 text-sm animate-pulse">
              {subMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Loader;

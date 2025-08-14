import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center p-5 font-inter">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center max-w-md w-full shadow-2xl">
        <div className="text-8xl mb-6">🔍</div>
        
        <h1 className="text-4xl font-bold text-white mb-4">
          404
        </h1>
        
        <h2 className="text-xl font-semibold text-white/90 mb-6">
          Page Not Found
        </h2>
        
        <p className="text-white/70 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved to another location.
        </p>
        
        <div className="space-y-4">
          <Link 
            to="/" 
            className="block w-full bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-medium py-3 px-6 rounded-xl hover:from-emerald-500 hover:to-teal-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            🏠 Back to Dashboard
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="block w-full bg-white/10 border border-white/20 text-white font-medium py-3 px-6 rounded-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

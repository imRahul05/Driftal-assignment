import React from 'react';

const PaginationBar = ({ pagination, onPageChange }) => {
  if (!pagination) return null;
  
  return (
    <div className="mt-6 space-y-3">
      {/* Pagination info */}
      <div className="text-center text-sm text-gray-600">
        Page {pagination.currentPage} of {pagination.totalPages} • Showing {pagination.limit} items per page • Total {pagination.totalCount} logs
      </div>
      <div className="flex justify-center gap-2">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onPageChange(1)}
            disabled={pagination.currentPage <= 1}
            className={`px-4 py-2 rounded border ${
              pagination.currentPage <= 1
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white text-blue-600 border-gray-300 hover:bg-blue-50'
            }`}
          >
            &laquo; First
          </button>
          
          <button
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage <= 1}
            className={`px-4 py-2 rounded border ${
              pagination.currentPage <= 1
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white text-blue-600 border-gray-300 hover:bg-blue-50'
            }`}
          >
            &lt; Prev
          </button>
          
          <div className="flex items-center gap-2">
            {/* Page numbers */}
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              // Calculate which page numbers to show
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.currentPage <= 3) {
                // Near the start
                pageNum = i + 1;
              } else if (pagination.currentPage >= pagination.totalPages - 2) {
                // Near the end
                pageNum = pagination.totalPages - 4 + i;
              } else {
                // In the middle
                pageNum = pagination.currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-12 h-10 mx-1 flex items-center justify-center rounded border font-medium ${
                    pagination.currentPage === pageNum
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className={`px-4 py-2 rounded border ${
              !pagination.hasNextPage
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white text-blue-600 border-gray-300 hover:bg-blue-50'
            }`}
          >
            Next &gt;
          </button>
          
          <button
            onClick={() => onPageChange(pagination.totalPages)}
            disabled={!pagination.hasNextPage}
            className={`px-4 py-2 rounded border ${
              !pagination.hasNextPage
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white text-blue-600 border-gray-300 hover:bg-blue-50'
            }`}
          >
            Last &raquo;
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginationBar;
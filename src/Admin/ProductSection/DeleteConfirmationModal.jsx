// components/DeleteConfirmationModal.jsx
import React from "react";
import { FaExclamationTriangle, FaTimes, FaInfoCircle } from "react-icons/fa";

const DeleteConfirmationModal = ({ 
  productName, 
  productDetails,
  onClose, 
  onConfirm,
  isLoading = false,
  warningMessage = "This action cannot be undone."
}) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div 
      className="fixed inset-0 backdrop-blur-xs bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-200 scale-95 animate-scaleIn">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mr-3">
                <FaExclamationTriangle className="text-red-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Confirm Deletion</h3>
            </div>
            <button 
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              onClick={onClose}
              disabled={isLoading}
              aria-label="Close"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
          
          {/* Warning Message */}
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
            <div className="flex items-start">
              <FaExclamationTriangle className="text-red-400 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-red-700">
                <strong>Warning:</strong> {warningMessage}
              </p>
            </div>
          </div>
          
          {/* Product Information */}
          <div className="mb-6">
            <p className="text-gray-700 mb-2">
              You are about to delete the following product:
            </p>
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="font-medium text-gray-800 truncate">{productName}</p>
              {productDetails && (
                <p className="text-sm text-gray-600 mt-1">{productDetails}</p>
              )}
            </div>
          </div>
          
          {/* Additional Warning for Data Loss */}
          <div className="flex items-start text-sm text-gray-600 mb-6">
            <FaInfoCircle className="text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
            <span>
              All product data, including images, descriptions, and reviews will be permanently removed from the system.
            </span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className="px-5 py-2.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                "Delete Product"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
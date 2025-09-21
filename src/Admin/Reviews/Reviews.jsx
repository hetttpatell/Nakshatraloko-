// components/Reviews/Reviews.jsx
import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  FaStar,
  FaEye,
  FaTrash,
  FaSearch,
  FaFilter,
  FaTimes,
  FaCheck,
  FaComment,
  FaUser,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Reviews = ({ isMobile }) => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [selectedReview, setSelectedReview] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = isMobile ? 5 : 10;

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
          const token = localStorage.getItem("authToken");

          const response = await axios.post(
            `${BACKEND_URL}getAllReviews`,
            {},
            {
              headers: {
                Authorization: `${token}`,
                
              }
            }
          );

        if (response.data.success && Array.isArray(response.data.reviews)) {
          // Transform the API response to match our component's expected structure
          const transformedReviews = response.data.reviews.map(review => ({
            ID: review.ReviewID,
            Rating: review.Rating,
            Comment: review.ReviewText,
            CreatedAt: review.Created_Date,
            ProductID: review.ProductID,
            ProductName: review.ProductName,
            UserID: review.UserID,
            UserName: review.UserName,
            IsApproved: true // Assuming all reviews are approved if not specified
          }));
          
          setReviews(transformedReviews);
          setFilteredReviews(transformedReviews);
        } else {
          throw new Error("Invalid response format from server");
        }
      } catch (err) {
        // console.error("Error fetching reviews:", err);
        setError("Failed to load reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Filter reviews based on search and filters
  useEffect(() => {
    let result = [...reviews];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(review =>
        (review.UserName && review.UserName.toLowerCase().includes(term)) ||
        (review.Comment && review.Comment.toLowerCase().includes(term)) ||
        (review.ProductName && review.ProductName.toLowerCase().includes(term))
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(review => {
        if (statusFilter === "approved") return review.IsApproved;
        if (statusFilter === "pending") return !review.IsApproved;
        return true;
      });
    }

    // Rating filter
    if (ratingFilter !== "all") {
      result = result.filter(review => review.Rating == ratingFilter);
    }

    setFilteredReviews(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, ratingFilter, reviews]);

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle review approval
  const handleApproveReview = async (reviewId) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${BACKEND_URL}approveReview/${reviewId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token || ""
        }
      });

      if (response.ok) {
        // Update local state
        setReviews(reviews.map(review =>
          review.ID === reviewId ? { ...review, IsApproved: true } : review
        ));
      } else {
        throw new Error("Failed to approve review");
      }
    } catch (err) {
      // console.error("Error approving review:", err);
      setError("Failed to approve review. Please try again.");
    }
  };

  // Handle review deletion
  const handleDeleteReview = async (reviewId) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${BACKEND_URL}deleteReview/${reviewId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token || ""
        }
      });

      if (response.ok) {
        // Remove from local state
        setReviews(reviews.filter(review => review.ID !== reviewId));
        setDeleteConfirm(null);
      } else {
        throw new Error("Failed to delete review");
      }
    } catch (err) {
      // console.error("Error deleting review:", err);
      setError("Failed to delete review. Please try again.");
    }
  };

  // Render star ratings
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
        size={isMobile ? 12 : 14}
      />
    ));
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 md:p-6 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Reviews Management</h2>

        {/* Stats summary */}
        <div className="flex gap-4 text-sm">
          <div className="text-center">
            <span className="font-semibold text-gray-800">{reviews.length}</span>
            <p className="text-gray-500">Total</p>
          </div>
          <div className="text-center">
            <span className="font-semibold text-green-600">
              {reviews.filter(r => r.IsApproved).length}
            </span>
            <p className="text-gray-500">Approved</p>
          </div>
          <div className="text-center">
            <span className="font-semibold text-yellow-600">
              {reviews.filter(r => !r.IsApproved).length}
            </span>
            <p className="text-gray-500">Pending</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex items-center">
            <FaExclamationTriangle className="mr-2" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-red-800 font-medium text-sm"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search reviews by user, product, or comment..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>

          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 font-semibold text-gray-600 text-sm">User & Product</th>
              {!isMobile && <th className="p-3 font-semibold text-gray-600 text-sm">Rating</th>}
              <th className="p-3 font-semibold text-gray-600 text-sm">Comment</th>
              {!isMobile && <th className="p-3 font-semibold text-gray-600 text-sm">Date</th>}
              <th className="p-3 font-semibold text-gray-600 text-sm">Status</th>
              <th className="p-3 font-semibold text-gray-600 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentReviews.length > 0 ? (
              currentReviews.map((review) => (
                <tr key={review.ID} className="hover:bg-gray-50 transition-colors">
                  {/* User & Product Info */}
                  <td className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <FaUser className="text-gray-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {review.UserName || "Anonymous"}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[120px]">
                          {review.ProductName || "Unknown Product"}
                        </p>
                        {isMobile && (
                          <div className="flex items-center mt-1">
                            {renderStars(review.Rating)}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Rating (hidden on mobile) */}
                  {!isMobile && (
                    <td className="p-3">
                      <div className="flex items-center">
                        {renderStars(review.Rating)}
                        <span className="ml-2 text-sm text-gray-600">({review.Rating})</span>
                      </div>
                    </td>
                  )}

                  {/* Comment */}
                  <td className="p-3">
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-800 line-clamp-2">
                        {review.Comment || "No comment provided"}
                      </p>
                    </div>
                  </td>

                  {/* Date (hidden on mobile) */}
                  {!isMobile && (
                    <td className="p-3 text-sm text-gray-600">
                      {review.CreatedAt ? formatDate(review.CreatedAt) : "N/A"}
                    </td>
                  )}

                  {/* Status */}
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${review.IsApproved
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {review.IsApproved ? "Approved" : "Pending"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3">
                    <div className="flex gap-2">
                      {!review.IsApproved && (
                        <button
                          onClick={() => handleApproveReview(review.ID)}
                          className="p-2 text-green-500 hover:bg-green-50 rounded-full transition-colors"
                          title="Approve review"
                        >
                          <FaCheck className="text-sm" />
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedReview(review)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                        title="View details"
                      >
                        <FaEye className="text-sm" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(review.ID)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete review"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isMobile ? 5 : 6} className="p-4 text-center text-gray-500">
                  {searchTerm || statusFilter !== "all" || ratingFilter !== "all"
                    ? "No reviews match your filters."
                    : "No reviews found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredReviews.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstReview + 1} to {Math.min(indexOfLastReview, filteredReviews.length)} of {filteredReviews.length} entries
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 transition-colors'}`}
              aria-label="Previous page"
            >
              <FaChevronLeft className="text-sm" />
            </button>

            {[...Array(totalPages)].map((_, i) => {
              // Show limited page numbers on mobile
              if (isMobile && (i + 1 < currentPage - 1 || i + 1 > currentPage + 1)) {
                if (i === 0 || i === totalPages - 1) {
                  return (
                    <button
                      key={i}
                      onClick={() => paginate(i + 1)}
                      className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 transition-colors'}`}
                    >
                      {i + 1}
                    </button>
                  );
                }
                if (i === currentPage - 2 || i === currentPage + 2) {
                  return <span key={i} className="px-1 self-center">...</span>;
                }
                return null;
              }

              return (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 transition-colors'}`}
                >
                  {i + 1}
                </button>
              );
            })}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 transition-colors'}`}
              aria-label="Next page"
            >
              <FaChevronRight className="text-sm" />
            </button>
          </div>
        </div>
      )}

      {/* Review Detail Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Review Details</h3>
                <button
                  className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                  onClick={() => setSelectedReview(null)}
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">User Information</h4>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <FaUser className="text-gray-600 text-xl" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedReview.UserName || "Anonymous"}</p>
                      <p className="text-sm text-gray-500">User ID: {selectedReview.UserID || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Product Information</h4>
                  <p className="font-medium">{selectedReview.ProductName || "Unknown Product"}</p>
                  <p className="text-sm text-gray-500">Product ID: {selectedReview.ProductID || "N/A"}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">Rating</h4>
                <div className="flex items-center">
                  {renderStars(selectedReview.Rating)}
                  <span className="ml-2 text-gray-600">({selectedReview.Rating} out of 5)</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">Comment</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800">{selectedReview.Comment || "No comment provided"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Review Date</h4>
                  <div className="flex items-center text-gray-600">
                    <FaCalendarAlt className="mr-2" />
                    <span>{selectedReview.CreatedAt ? formatDate(selectedReview.CreatedAt) : "N/A"}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Status</h4>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${selectedReview.IsApproved
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                      }`}
                  >
                    {selectedReview.IsApproved ? "Approved" : "Pending Approval"}
                  </span>
                </div>
              </div>

              {!selectedReview.IsApproved && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => {
                      handleApproveReview(selectedReview.ID);
                      setSelectedReview(null);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Approve Review
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                <FaExclamationTriangle className="text-red-600 text-xl" />
              </div>

              <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                Confirm Deletion
              </h3>

              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete this review? This action cannot be undone.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button
                  className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  onClick={() => handleDeleteReview(deleteConfirm)}
                >
                  Delete Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
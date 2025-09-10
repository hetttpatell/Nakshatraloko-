// components/Consultancy.jsx
import React, { useState, useEffect, useContext } from "react";import {
  FaEye,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaWhatsapp,
  FaPhone,
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaMapMarkerAlt,
  FaVenusMars
} from "react-icons/fa";
import  ConsultancyContext  from "../../Context/ConsultancyContext";
import axios from "axios";
// const [category ,setcategory]= useState([])

//  useEffect(()=>{
//   axios
//   .post("http://localhost:8001/api/getAllCatogary")
//   .then((res)=>{
//     if(res.data.data){
//       setcategory(res.data.data)
//       }
//   })
//  },[])
const Consultancy = () => {
  // Sample data - in a real app, this would come from your backend
  const { submissions, updateSubmission, deleteSubmission } = useContext(ConsultancyContext);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formTypeFilter, setFormTypeFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [editingSubmission, setEditingSubmission] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Filter submissions based on search and filters
  const filteredSubmissions = submissions.filter(submission => {
    // Search filter
    if (searchTerm && 
        !submission.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !submission.phone.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Status filter
    if (statusFilter !== "all" && submission.status !== statusFilter) {
      return false;
    }
    
    // Form type filter
    if (formTypeFilter !== "all" && submission.formType !== formTypeFilter) {
      return false;
    }
    
    return true;
  });

  const handleEditSubmission = () => {
    if (!editingSubmission) return;
    
    updateSubmission(editingSubmission.id, editingSubmission);
    setEditingSubmission(null);
  };

  const handleDeleteSubmission = (id) => {
    deleteSubmission(id);
    setDeleteConfirm(null);
  };

  const updateSubmissionStatus = (id, newStatus) => {
    updateSubmission(id, { status: newStatus });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800";
      case "contacted": return "bg-yellow-100 text-yellow-800";
      case "scheduled": return "bg-purple-100 text-purple-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "new": return "New";
      case "contacted": return "Contacted";
      case "scheduled": return "Scheduled";
      case "completed": return "Completed";
      case "cancelled": return "Cancelled";
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Consultancy Requests</h2>
        <div className="text-sm text-gray-500">
          Total: {submissions.length} | Showing: {filteredSubmissions.length}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or phone number..."
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
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formTypeFilter}
            onChange={(e) => setFormTypeFilter(e.target.value)}
          >
            <option value="all">All Forms</option>
            <option value="HelpingForm">Helping Form</option>
            <option value="ExpertCall">Expert Call</option>
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 font-semibold text-gray-700">User</th>
              <th className="p-3 font-semibold text-gray-700">Contact</th>
              <th className="p-3 font-semibold text-gray-700">Form Type</th>
              <th className="p-3 font-semibold text-gray-700">Preferred Time</th>
              <th className="p-3 font-semibold text-gray-700">Status</th>
              <th className="p-3 font-semibold text-gray-700">Submitted</th>
              <th className="p-3 font-semibold text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map(submission => (
              <tr key={submission.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="p-3">
                  <div className="font-medium text-gray-800">{submission.username}</div>
                  {submission.formType === "ExpertCall" && submission.gender && (
                    <div className="text-xs text-gray-500 flex items-center">
                      <FaVenusMars className="mr-1" />
                      {submission.gender}
                    </div>
                  )}
                </td>
                <td className="p-3">
                  <div className="text-gray-800">{submission.phone}</div>
                  <div className="flex gap-2 mt-1">
                    <a
                      href={`tel:${submission.phone}`}
                      className="text-blue-500 hover:text-blue-700"
                      title="Call"
                    >
                      <FaPhone size={14} />
                    </a>
                    <a
                      href={`https://wa.me/${submission.phone.replace(/\D/g, '')}`}
                      className="text-green-500 hover:text-green-700"
                      title="WhatsApp"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaWhatsapp size={14} />
                    </a>
                  </div>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    submission.formType === "HelpingForm" 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-purple-100 text-purple-800"
                  }`}>
                    {submission.formType === "HelpingForm" ? "Helping Form" : "Expert Call"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="text-sm">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-1 text-gray-500" size={12} />
                      {formatDate(submission.date)}
                    </div>
                    <div className="flex items-center">
                      <FaClock className="mr-1 text-gray-500" size={12} />
                      {formatTime(submission.time)}
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <select
                    value={submission.status}
                    onChange={(e) => updateSubmissionStatus(submission.id, e.target.value)}
                    className={`text-xs font-medium px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${getStatusBadgeClass(submission.status)}`}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="p-3">
                  <div className="text-xs text-gray-500">
                    {formatDate(submission.createdAt)}
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                      title="View details"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => setEditingSubmission({...submission})}
                      className="p-2 text-green-500 hover:bg-green-50 rounded transition-colors"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(submission)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredSubmissions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No consultancy requests found matching your criteria.
        </div>
      )}

      {/* View Details Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Consultation Request Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">User Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedSubmission.username}</p>
                    <p><span className="font-medium">Phone:</span> {selectedSubmission.phone}</p>
                    {selectedSubmission.formType === "ExpertCall" && (
                      <>
                        {selectedSubmission.gender && (
                          <p><span className="font-medium">Gender:</span> {selectedSubmission.gender}</p>
                        )}
                        {selectedSubmission.birthDate && (
                          <p><span className="font-medium">Birth Date:</span> {formatDate(selectedSubmission.birthDate)}</p>
                        )}
                        {selectedSubmission.birthTime && (
                          <p><span className="font-medium">Birth Time:</span> {formatTime(selectedSubmission.birthTime)}</p>
                        )}
                        {selectedSubmission.birthPlace && (
                          <p><span className="font-medium">Birth Place:</span> {selectedSubmission.birthPlace}</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Appointment Details</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Form Type:</span> {selectedSubmission.formType === "HelpingForm" ? "Helping Form" : "Expert Call"}</p>
                    <p><span className="font-medium">Preferred Date:</span> {formatDate(selectedSubmission.date)}</p>
                    <p><span className="font-medium">Preferred Time:</span> {formatTime(selectedSubmission.time)}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(selectedSubmission.status)}`}>
                        {getStatusText(selectedSubmission.status)}
                      </span>
                    </p>
                    <p><span className="font-medium">Submitted:</span> {formatDate(selectedSubmission.createdAt)}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Edit Consultation Request</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editingSubmission.username}
                    onChange={(e) => setEditingSubmission({...editingSubmission, username: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingSubmission.phone}
                    onChange={(e) => setEditingSubmission({...editingSubmission, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={editingSubmission.date}
                    onChange={(e) => setEditingSubmission({...editingSubmission, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                  <input
                    type="time"
                    value={editingSubmission.time}
                    onChange={(e) => setEditingSubmission({...editingSubmission, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {editingSubmission.formType === "ExpertCall" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                      <input
                        type="date"
                        value={editingSubmission.birthDate || ""}
                        onChange={(e) => setEditingSubmission({...editingSubmission, birthDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Birth Time</label>
                      <input
                        type="time"
                        value={editingSubmission.birthTime || ""}
                        onChange={(e) => setEditingSubmission({...editingSubmission, birthTime: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Birth Place</label>
                      <input
                        type="text"
                        value={editingSubmission.birthPlace || ""}
                        onChange={(e) => setEditingSubmission({...editingSubmission, birthPlace: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        value={editingSubmission.gender || ""}
                        onChange={(e) => setEditingSubmission({...editingSubmission, gender: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </>
                )}
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editingSubmission.status}
                    onChange={(e) => setEditingSubmission({...editingSubmission, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditingSubmission(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmission}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the consultation request from {deleteConfirm.username}? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteSubmission(deleteConfirm.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Consultancy;
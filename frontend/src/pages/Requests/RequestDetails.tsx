import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { requests } from '../../services/api';
import { BloodRequest } from '../../types';
import { 
  ArrowLeft, 
  Heart, 
  User, 
  Calendar, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Phone,
  Mail
} from 'lucide-react';

const RequestDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [request, setRequest] = useState<BloodRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    if (id) {
      fetchRequest();
    }
  }, [id]);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const response = await requests.getById(id!);
      setRequest(response.data);
      setStatus(response.data.status);
      setNotes(response.data.notes || '');
    } catch (error) {
      console.error('Error fetching request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!request) return;

    try {
      setUpdating(true);
      await requests.updateStatus(request._id, status, notes);
      setShowUpdateForm(false);
      fetchRequest(); // Refresh data
    } catch (error: any) {
      console.error('Error updating request:', error);
      alert(error.response?.data?.message || 'Failed to update request');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'approved': return <CheckCircle className="h-6 w-6 text-blue-500" />;
      case 'fulfilled': return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'rejected': return <XCircle className="h-6 w-6 text-red-500" />;
      case 'cancelled': return <XCircle className="h-6 w-6 text-gray-500" />;
      default: return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fulfilled': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const canUpdateStatus = () => {
    return user?.role === 'admin' || user?.role === 'hospital';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Request Not Found</h1>
          <button 
            onClick={() => navigate('/requests')}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Back to Requests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/requests')}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blood Request Details</h1>
            <p className="mt-2 text-gray-600">Request ID: {request.requestId}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Overview */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Heart className="h-5 w-5 text-red-500 mr-2" />
                  Request Overview
                </h3>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Blood Group</label>
                    <div className="mt-1 flex items-center space-x-2">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 font-medium text-sm">
                          {request.bloodGroup}
                        </span>
                      </div>
                      <span className="text-lg font-medium text-gray-900">
                        {request.bloodGroup}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Units Needed</label>
                    <p className="mt-1 text-lg font-medium text-gray-900">{request.unitsNeeded} units</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Urgency</label>
                    <div className="mt-1">
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency === 'critical' && <AlertTriangle className="h-4 w-4 mr-1" />}
                        {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Required By</label>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      {new Date(request.requiredBy).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Information */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <User className="h-5 w-5 text-blue-500 mr-2" />
                  Patient Information
                </h3>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Patient Name</label>
                    <p className="mt-1 text-lg font-medium text-gray-900">{request.patientName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Age</label>
                    <p className="mt-1 text-lg font-medium text-gray-900">{request.patientAge} years</p>
                  </div>
                  {request.reason && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-500">Medical Reason</label>
                      <p className="mt-1 text-gray-900">{request.reason}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Hospital Information */}
            {request.hospitalId && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Hospital Information</h3>
                </div>
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Hospital Name</label>
                      <p className="mt-1 text-lg font-medium text-gray-900">
                        {typeof request.hospitalId === 'object' ? request.hospitalId.name : 'N/A'}
                      </p>
                    </div>
                    {typeof request.hospitalId === 'object' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Contact</label>
                          <div className="mt-1 space-y-1">
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-900">{request.hospitalId.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-900">{request.hospitalId.email}</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {request.notes && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Admin Notes</h3>
                </div>
                <div className="px-6 py-4">
                  <p className="text-gray-900">{request.notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Status</h3>
              </div>
              <div className="px-6 py-4">
                <div className="flex items-center space-x-3 mb-4">
                  {getStatusIcon(request.status)}
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>

                {canUpdateStatus() && !showUpdateForm && (
                  <button
                    onClick={() => setShowUpdateForm(true)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Update Status</span>
                  </button>
                )}

                {showUpdateForm && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="fulfilled">Fulfilled</option>
                        <option value="rejected">Rejected</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Add any notes about the status update..."
                      />
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={handleStatusUpdate}
                        disabled={updating}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {updating ? 'Updating...' : 'Update'}
                      </button>
                      <button
                        onClick={() => setShowUpdateForm(false)}
                        className="flex-1 bg-gray-200 text-gray-800 px-3 py-2 rounded-md hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Timeline</h3>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Request Created</p>
                      <p className="text-xs text-gray-500">
                        {new Date(request.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {request.updatedAt !== request.createdAt && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Last Updated</p>
                        <p className="text-xs text-gray-500">
                          {new Date(request.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
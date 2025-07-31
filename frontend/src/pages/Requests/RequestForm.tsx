import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { requests } from '../../services/api';
import { Heart, Calendar, AlertTriangle, User, Hash } from 'lucide-react';

const RequestForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    bloodGroup: '',
    unitsNeeded: 1,
    urgency: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    patientName: '',
    patientAge: '',
    reason: '',
    requiredBy: '',
    hospitalId: user?.role === 'hospital' ? user.id : '',
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-orange-600' },
    { value: 'critical', label: 'Critical', color: 'text-red-600' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'unitsNeeded' || name === 'patientAge' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await requests.create(formData);
      navigate('/requests');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create blood request');
    } finally {
      setLoading(false);
    }
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Blood Request</h1>
          <p className="mt-2 text-gray-600">
            Submit a new blood request for urgent medical needs
          </p>
        </div>

        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <User className="h-5 w-5 text-gray-500 mr-2" />
                  Patient Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    required
                    value={formData.patientName}
                    onChange={handleChange}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter patient's full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Age *
                  </label>
                  <input
                    type="number"
                    name="patientAge"
                    required
                    min="1"
                    max="120"
                    value={formData.patientAge}
                    onChange={handleChange}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter patient's age"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical Reason
                  </label>
                  <textarea
                    name="reason"
                    rows={3}
                    value={formData.reason}
                    onChange={handleChange}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="Brief description of medical condition or reason for blood requirement"
                  />
                </div>
              </div>

              {/* Blood Requirements */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Heart className="h-5 w-5 text-red-500 mr-2" />
                  Blood Requirements
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group *
                  </label>
                  <select
                    name="bloodGroup"
                    required
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Select Blood Group</option>
                    {bloodGroups.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Units Needed *
                  </label>
                  <input
                    type="number"
                    name="unitsNeeded"
                    required
                    min="1"
                    max="20"
                    value={formData.unitsNeeded}
                    onChange={handleChange}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Number of blood units required (1 unit = 450ml approximately)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency Level *
                  </label>
                  <select
                    name="urgency"
                    required
                    value={formData.urgency}
                    onChange={handleChange}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                  >
                    {urgencyLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600">• Low:</span>
                      <span className="text-gray-600">Routine procedures, planned surgeries</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-600">• Medium:</span>
                      <span className="text-gray-600">Semi-urgent procedures, moderate blood loss</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-orange-600">• High:</span>
                      <span className="text-gray-600">Urgent surgeries, significant blood loss</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-red-600">• Critical:</span>
                      <span className="text-gray-600">Life-threatening emergencies</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required By *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      name="requiredBy"
                      required
                      min={today}
                      value={formData.requiredBy}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Latest date when blood is needed
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Contact Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Important Information
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>All blood requests will be reviewed by medical staff</li>
                      <li>Critical requests are processed within 2 hours</li>
                      <li>Please ensure all information is accurate</li>
                      <li>You will be notified once the request is approved</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/requests')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Heart className="h-4 w-4" />
                    <span>Submit Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestForm;
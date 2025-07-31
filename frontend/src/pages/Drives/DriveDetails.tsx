import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { drives } from '../../services/api';
import { DonationDrive } from '../../types';
import { ArrowLeft, Calendar, MapPin, Users, Clock, Phone, Mail, UserPlus } from 'lucide-react';

const DriveDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [drive, setDrive] = useState<DonationDrive | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDrive();
    }
  }, [id]);

  const fetchDrive = async () => {
    try {
      setLoading(true);
      const response = await drives.getById(id!);
      setDrive(response.data);
    } catch (error) {
      console.error('Error fetching drive:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!drive) return;
    
    try {
      setRegistering(true);
      await drives.register(drive._id);
      fetchDrive(); // Refresh data
    } catch (error: any) {
      console.error('Error registering:', error);
      alert(error.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ongoing': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div></div>;

  if (!drive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Drive Not Found</h1>
          <button onClick={() => navigate('/drives')} className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700">
            Back to Drives
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <button onClick={() => navigate('/drives')} className="mr-4 p-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{drive.title}</h1>
            <p className="mt-2 text-gray-600">Donation Drive Details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Event Overview</h3>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(drive.status)}`}>
                    {drive.status.charAt(0).toUpperCase() + drive.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="px-6 py-4">
                {drive.description && (
                  <p className="text-gray-700 mb-4">{drive.description}</p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-3" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-sm">
                        {new Date(drive.startDate).toLocaleDateString()} - {new Date(drive.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-3" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-sm">{drive.startTime} - {drive.endTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-3" />
                    <div>
                      <p className="font-medium">Target Donors</p>
                      <p className="text-sm">{drive.targetDonors} donors</p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <UserPlus className="h-5 w-5 mr-3" />
                    <div>
                      <p className="font-medium">Registered</p>
                      <p className="text-sm">{drive.registeredDonors} donors</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <MapPin className="h-5 w-5 text-red-500 mr-2" />
                  Location
                </h3>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{drive.location.name}</p>
                  <p className="text-gray-600">{drive.location.address}</p>
                  <p className="text-gray-600">
                    {drive.location.city}, {drive.location.state} {drive.location.zipCode}
                  </p>
                </div>
              </div>
            </div>

            {/* Requirements */}
            {drive.requirements && drive.requirements.length > 0 && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Requirements</h3>
                </div>
                <div className="px-6 py-4">
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {drive.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Contact Info */}
            {(drive.contactInfo.name || drive.contactInfo.phone || drive.contactInfo.email) && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                </div>
                <div className="px-6 py-4">
                  <div className="space-y-2">
                    {drive.contactInfo.name && (
                      <p className="text-gray-900 font-medium">{drive.contactInfo.name}</p>
                    )}
                    {drive.contactInfo.phone && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{drive.contactInfo.phone}</span>
                      </div>
                    )}
                    {drive.contactInfo.email && (
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{drive.contactInfo.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Registration Progress</h3>
              </div>
              <div className="px-6 py-4">
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Registered</span>
                    <span>{drive.registeredDonors}/{drive.targetDonors}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-red-600 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min((drive.registeredDonors / drive.targetDonors) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((drive.registeredDonors / drive.targetDonors) * 100)}% of target reached
                  </p>
                </div>

                {drive.status === 'upcoming' && (
                  <button
                    onClick={handleRegister}
                    disabled={registering}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {registering ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        <span>Register to Donate</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Organizer */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Organizer</h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-gray-900 font-medium">
                  {typeof drive.organizer === 'object' ? drive.organizer.name : 'Hospital'}
                </p>
                {typeof drive.organizer === 'object' && (
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{drive.organizer.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{drive.organizer.email}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Statistics</h3>
              </div>
              <div className="px-6 py-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Target Donors:</span>
                  <span className="font-medium">{drive.targetDonors}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Registered:</span>
                  <span className="font-medium">{drive.registeredDonors}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-medium">{drive.completedDonations}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-600">Success Rate:</span>
                  <span className="font-medium">
                    {drive.registeredDonors > 0 
                      ? Math.round((drive.completedDonations / drive.registeredDonors) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriveDetails;
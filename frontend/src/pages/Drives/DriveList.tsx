import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { drives } from '../../services/api';
import { DonationDrive } from '../../types';
import { Plus, Calendar, MapPin, Users, Eye } from 'lucide-react';

const DriveList: React.FC = () => {
  const { user } = useAuth();
  const [driveList, setDriveList] = useState<DonationDrive[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchDrives();
  }, [filter]);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const params: any = { page: 1, limit: 20 };
      if (filter === 'upcoming') params.upcoming = true;
      if (filter !== 'all') params.status = filter;

      const response = await drives.getAll(params);
      setDriveList(response.data.data);
    } catch (error) {
      console.error('Error fetching drives:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Donation Drives</h1>
            <p className="mt-2 text-gray-600">Community blood donation events</p>
          </div>
          {(user?.role === 'admin' || user?.role === 'hospital') && (
            <Link to="/drives/new" className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Create Drive</span>
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-6">
            <div className="flex space-x-4">
              {['all', 'upcoming', 'ongoing', 'completed'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === filterOption
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Drives Grid */}
        {driveList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {driveList.map((drive) => (
              <div key={drive._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(drive.status)}`}>
                      {drive.status}
                    </span>
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{drive.title}</h3>
                  
                  {drive.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {drive.description}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(drive.startDate).toLocaleDateString()} - {new Date(drive.endDate).toLocaleDateString()}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {drive.location.city}, {drive.location.state}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {drive.registeredDonors}/{drive.targetDonors} registered
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ width: `${Math.min((drive.registeredDonors / drive.targetDonors) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round((drive.registeredDonors / drive.targetDonors) * 100)}% of target reached
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      by {typeof drive.organizer === 'object' ? drive.organizer.name : 'Hospital'}
                    </span>
                    <Link
                      to={`/drives/${drive._id}`}
                      className="text-red-600 hover:text-red-900 text-sm font-medium flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg">
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No donation drives found</p>
              {(user?.role === 'admin' || user?.role === 'hospital') && (
                <Link to="/drives/new" className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors">
                  Create First Drive
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriveList;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { admin, requests, drives, notifications } from '../../services/api';
import { 
  Users, 
  Heart, 
  AlertTriangle, 
  Calendar, 
  TrendingUp,
  Bell,
  Clock,
  CheckCircle
} from 'lucide-react';
import { DashboardStats, BloodRequest, DonationDrive, Notification } from '../../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentRequests, setRecentRequests] = useState<BloodRequest[]>([]);
  const [upcomingDrives, setUpcomingDrives] = useState<DonationDrive[]>([]);
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user?.role]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      if (user?.role === 'admin') {
        const dashboardResponse = await admin.getDashboard();
        setStats(dashboardResponse.data.stats);
        setRecentRequests(dashboardResponse.data.recentRequests);
      } else {
        // For non-admin users, fetch their specific data
        const [requestsResponse, drivesResponse] = await Promise.all([
          requests.getAll({ page: 1, limit: 5 }),
          drives.getAll({ page: 1, limit: 5, upcoming: true }),
        ]);

        setRecentRequests(requestsResponse.data.data);
        setUpcomingDrives(drivesResponse.data.data);
      }

      // Fetch notifications for all users
      const notificationsResponse = await notifications.getAll({ page: 1, limit: 5, unread: true });
      setRecentNotifications(notificationsResponse.data.data);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-blue-600 bg-blue-100';
      case 'fulfilled': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {getGreeting()}, {user?.name}!
          </h1>
          <p className="mt-2 text-gray-600">
            {user?.role === 'admin' && 'Monitor and manage the blood bank system'}
            {user?.role === 'hospital' && 'Manage your hospital\'s blood requests and inventory'}
            {user?.role === 'patient' && 'Track your blood requests and donation opportunities'}
          </p>
        </div>

        {/* Stats Cards - Admin Only */}
        {user?.role === 'admin' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Donors
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.totalDonors}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Heart className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Blood Requests
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.totalRequests}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Critical Requests
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.criticalRequests}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Drives
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.activeDrives}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Blood Requests */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Heart className="h-5 w-5 text-red-500 mr-2" />
                Recent Blood Requests
              </h3>
            </div>
            <div className="px-6 py-4">
              {recentRequests.length > 0 ? (
                <div className="space-y-4">
                  {recentRequests.map((request) => (
                    <div key={request._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-600 font-medium text-sm">
                              {request.bloodGroup}
                            </span>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {request.patientName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {request.unitsNeeded} units needed
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.urgency)}`}>
                          {request.urgency}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent blood requests</p>
              )}
            </div>
          </div>

          {/* Upcoming Donation Drives or Notifications */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                {upcomingDrives.length > 0 ? (
                  <>
                    <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                    Upcoming Donation Drives
                  </>
                ) : (
                  <>
                    <Bell className="h-5 w-5 text-yellow-500 mr-2" />
                    Recent Notifications
                  </>
                )}
              </h3>
            </div>
            <div className="px-6 py-4">
              {upcomingDrives.length > 0 ? (
                <div className="space-y-4">
                  {upcomingDrives.map((drive) => (
                    <div key={drive._id} className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{drive.title}</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(drive.startDate).toLocaleDateString()} at {drive.location.city}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-blue-600 font-medium">
                            {drive.registeredDonors}/{drive.targetDonors} registered
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentNotifications.length > 0 ? (
                <div className="space-y-4">
                  {recentNotifications.map((notification) => (
                    <div key={notification._id} className="p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Bell className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No upcoming drives or notifications</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {user?.role === 'patient' && (
                <button className="p-4 bg-red-50 rounded-lg text-left hover:bg-red-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Heart className="h-6 w-6 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">Request Blood</p>
                      <p className="text-sm text-gray-600">Submit a new blood request</p>
                    </div>
                  </div>
                </button>
              )}
              
              {(user?.role === 'admin' || user?.role === 'hospital') && (
                <>
                  <button className="p-4 bg-blue-50 rounded-lg text-left hover:bg-blue-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Users className="h-6 w-6 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Manage Donors</p>
                        <p className="text-sm text-gray-600">View and manage donor information</p>
                      </div>
                    </div>
                  </button>
                  
                  <button className="p-4 bg-green-50 rounded-lg text-left hover:bg-green-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">Inventory</p>
                        <p className="text-sm text-gray-600">Check blood inventory levels</p>
                      </div>
                    </div>
                  </button>
                </>
              )}

              <button className="p-4 bg-purple-50 rounded-lg text-left hover:bg-purple-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-6 w-6 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Donation Drives</p>
                    <p className="text-sm text-gray-600">View upcoming events</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
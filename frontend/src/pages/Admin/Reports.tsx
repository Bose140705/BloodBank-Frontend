import React, { useState, useEffect } from 'react';
import { reports, admin } from '../../services/api';
import { BarChart3, TrendingUp, Calendar, FileText, Download } from 'lucide-react';

const Reports: React.FC = () => {
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [inventoryReport, setInventoryReport] = useState<any>(null);
  const [donationStats, setDonationStats] = useState<any>(null);
  const [requestReport, setRequestReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState('dashboard');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const dashboardResponse = await admin.getDashboard();
      setDashboardStats(dashboardResponse.data);

      // Fetch other reports
      const [inventoryResponse, donationResponse, requestResponse] = await Promise.all([
        reports.getInventoryReport(),
        reports.getDonationStats(),
        reports.getRequestReport()
      ]);

      setInventoryReport(inventoryResponse.data);
      setDonationStats(donationResponse.data);
      setRequestReport(requestResponse.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="mt-2 text-gray-600">Comprehensive insights into blood bank operations</p>
        </div>

        {/* Report Navigation */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-6">
            <div className="flex space-x-4">
              {[
                { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { key: 'inventory', label: 'Inventory', icon: FileText },
                { key: 'donations', label: 'Donations', icon: TrendingUp },
                { key: 'requests', label: 'Requests', icon: Calendar }
              ].map((report) => {
                const Icon = report.icon;
                return (
                  <button
                    key={report.key}
                    onClick={() => setSelectedReport(report.key)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedReport === report.key
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{report.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dashboard Report */}
        {selectedReport === 'dashboard' && dashboardStats && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-semibold text-gray-900">{dashboardStats.stats?.totalUsers || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Donors</p>
                    <p className="text-2xl font-semibold text-gray-900">{dashboardStats.stats?.totalDonors || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Blood Requests</p>
                    <p className="text-2xl font-semibold text-gray-900">{dashboardStats.stats?.totalRequests || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <FileText className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Critical Requests</p>
                    <p className="text-2xl font-semibold text-gray-900">{dashboardStats.stats?.criticalRequests || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Blood Inventory Summary */}
            {dashboardStats.inventorySummary && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Blood Inventory Summary</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bloodGroup) => {
                      const groupData = dashboardStats.inventorySummary.find((item: any) => item._id === bloodGroup);
                      return (
                        <div key={bloodGroup} className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-red-600 font-medium">{bloodGroup}</span>
                          </div>
                          <p className="text-2xl font-bold text-gray-900">{groupData?.totalUnits || 0}</p>
                          <p className="text-xs text-gray-500">units</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Recent Requests */}
            {dashboardStats.recentRequests && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Blood Requests</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {dashboardStats.recentRequests.slice(0, 5).map((request: any) => (
                      <div key={request._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-600 font-medium text-sm">{request.bloodGroup}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{request.patientName}</p>
                            <p className="text-sm text-gray-500">{request.unitsNeeded} units needed</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{request.urgency}</p>
                          <p className="text-xs text-gray-500">{new Date(request.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Other Report Views */}
        {selectedReport === 'inventory' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Inventory Report</h3>
              <button className="flex items-center space-x-2 text-red-600 hover:text-red-700">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Detailed inventory analysis coming soon...</p>
            </div>
          </div>
        )}

        {selectedReport === 'donations' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Donation Statistics</h3>
              <button className="flex items-center space-x-2 text-red-600 hover:text-red-700">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Donation trends and analytics coming soon...</p>
            </div>
          </div>
        )}

        {selectedReport === 'requests' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Request Analysis</h3>
              <button className="flex items-center space-x-2 text-red-600 hover:text-red-700">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Request fulfillment analysis coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
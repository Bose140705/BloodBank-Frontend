import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Navbar from './components/Layout/Navbar';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Dashboard
import Dashboard from './pages/Dashboard/Dashboard';

// Donor Management
import DonorList from './pages/Donors/DonorList';
import DonorForm from './pages/Donors/DonorForm';
import DonorDetails from './pages/Donors/DonorDetails';

// Blood Inventory
import InventoryList from './pages/Inventory/InventoryList';
import InventoryForm from './pages/Inventory/InventoryForm';

// Blood Requests
import RequestList from './pages/Requests/RequestList';
import RequestForm from './pages/Requests/RequestForm';
import RequestDetails from './pages/Requests/RequestDetails';

// Donation Drives
import DriveList from './pages/Drives/DriveList';
import DriveForm from './pages/Drives/DriveForm';
import DriveDetails from './pages/Drives/DriveDetails';

// Admin Pages
import UserList from './pages/Admin/UserList';
import Reports from './pages/Admin/Reports';

// Profile
import Profile from './pages/Profile/Profile';

import './App.css';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar />}
      
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/dashboard" replace /> : <Register />} 
        />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Blood Requests - All roles */}
        <Route path="/requests" element={
          <ProtectedRoute>
            <RequestList />
          </ProtectedRoute>
        } />
        <Route path="/requests/new" element={
          <ProtectedRoute allowedRoles={['patient', 'hospital']}>
            <RequestForm />
          </ProtectedRoute>
        } />
        <Route path="/requests/:id" element={
          <ProtectedRoute>
            <RequestDetails />
          </ProtectedRoute>
        } />

        {/* Donation Drives - All roles */}
        <Route path="/drives" element={
          <ProtectedRoute>
            <DriveList />
          </ProtectedRoute>
        } />
        <Route path="/drives/new" element={
          <ProtectedRoute allowedRoles={['admin', 'hospital']}>
            <DriveForm />
          </ProtectedRoute>
        } />
        <Route path="/drives/:id" element={
          <ProtectedRoute>
            <DriveDetails />
          </ProtectedRoute>
        } />

        {/* Donors - Admin and Hospital only */}
        <Route path="/donors" element={
          <ProtectedRoute allowedRoles={['admin', 'hospital']}>
            <DonorList />
          </ProtectedRoute>
        } />
        <Route path="/donors/new" element={
          <ProtectedRoute allowedRoles={['admin', 'hospital']}>
            <DonorForm />
          </ProtectedRoute>
        } />
        <Route path="/donors/:id" element={
          <ProtectedRoute allowedRoles={['admin', 'hospital']}>
            <DonorDetails />
          </ProtectedRoute>
        } />
        <Route path="/donors/:id/edit" element={
          <ProtectedRoute allowedRoles={['admin', 'hospital']}>
            <DonorForm />
          </ProtectedRoute>
        } />

        {/* Blood Inventory - Admin and Hospital only */}
        <Route path="/inventory" element={
          <ProtectedRoute allowedRoles={['admin', 'hospital']}>
            <InventoryList />
          </ProtectedRoute>
        } />
        <Route path="/inventory/new" element={
          <ProtectedRoute allowedRoles={['admin', 'hospital']}>
            <InventoryForm />
          </ProtectedRoute>
        } />

        {/* Admin Only Routes */}
        <Route path="/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UserList />
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Reports />
          </ProtectedRoute>
        } />

        {/* Default Routes */}
        <Route path="/" element={
          user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } />

        {/* Unauthorized */}
        <Route path="/unauthorized" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
              <p className="text-gray-600 mb-8">You don't have permission to access this page.</p>
              <button 
                onClick={() => window.history.back()}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        } />

        {/* 404 */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
              <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
              <button 
                onClick={() => window.history.back()}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        } />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
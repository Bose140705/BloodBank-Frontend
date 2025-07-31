import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Phone, MapPin, Heart, Calendar, Save } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bloodGroup: user?.bloodGroup || '',
    dateOfBirth: user?.dateOfBirth || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || ''
    },
    emergencyContact: {
      name: user?.emergencyContact?.name || '',
      phone: user?.emergencyContact?.phone || '',
      relation: user?.emergencyContact?.relation || ''
    }
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUser(formData);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent as keyof typeof prev] as any, [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      bloodGroup: user?.bloodGroup || '',
      dateOfBirth: user?.dateOfBirth || '',
      address: {
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        zipCode: user?.address?.zipCode || ''
      },
      emergencyContact: {
        name: user?.emergencyContact?.name || '',
        phone: user?.emergencyContact?.phone || '',
        relation: user?.emergencyContact?.relation || ''
      }
    });
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-gray-600">Manage your account information</p>
        </div>

        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{user?.name}</h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                      {user?.role}
                    </span>
                  </div>
                </div>
                
                {!editing ? (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="space-x-2">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Save</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 flex items-center">
                  <User className="h-5 w-5 text-gray-500 mr-2" />
                  Basic Information
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    {editing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                      />
                    ) : (
                      <p className="py-2 text-gray-900">{user?.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="flex items-center space-x-2 py-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{user?.email}</span>
                    </div>
                    <p className="text-xs text-gray-500">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    {editing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 py-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{user?.phone}</span>
                      </div>
                    )}
                  </div>

                  {user?.role === 'patient' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                        {editing ? (
                          <select
                            name="bloodGroup"
                            value={formData.bloodGroup}
                            onChange={handleChange}
                            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                          >
                            <option value="">Select Blood Group</option>
                            {bloodGroups.map(bg => (
                              <option key={bg} value={bg}>{bg}</option>
                            ))}
                          </select>
                        ) : (
                          <div className="flex items-center space-x-2 py-2">
                            <Heart className="h-4 w-4 text-red-400" />
                            <span className="text-gray-900">{user?.bloodGroup || 'Not specified'}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                        {editing ? (
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                          />
                        ) : (
                          <div className="flex items-center space-x-2 py-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">
                              {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not specified'}
                            </span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 flex items-center">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                  Address
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                    {editing ? (
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                      />
                    ) : (
                      <p className="py-2 text-gray-900">{user?.address?.street || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    {editing ? (
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                      />
                    ) : (
                      <p className="py-2 text-gray-900">{user?.address?.city || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    {editing ? (
                      <input
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                      />
                    ) : (
                      <p className="py-2 text-gray-900">{user?.address?.state || 'Not specified'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Emergency Contact - Patient only */}
              {user?.role === 'patient' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Emergency Contact</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      {editing ? (
                        <input
                          type="text"
                          name="emergencyContact.name"
                          value={formData.emergencyContact.name}
                          onChange={handleChange}
                          className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                        />
                      ) : (
                        <p className="py-2 text-gray-900">{user?.emergencyContact?.name || 'Not specified'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      {editing ? (
                        <input
                          type="tel"
                          name="emergencyContact.phone"
                          value={formData.emergencyContact.phone}
                          onChange={handleChange}
                          className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                        />
                      ) : (
                        <p className="py-2 text-gray-900">{user?.emergencyContact?.phone || 'Not specified'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Relation</label>
                      {editing ? (
                        <input
                          type="text"
                          name="emergencyContact.relation"
                          value={formData.emergencyContact.relation}
                          onChange={handleChange}
                          className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                          placeholder="e.g., Spouse, Parent, Sibling"
                        />
                      ) : (
                        <p className="py-2 text-gray-900">{user?.emergencyContact?.relation || 'Not specified'}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Account Information */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-medium text-gray-900">Account Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Created</label>
                    <p className="py-2 text-gray-900">{new Date(user?.createdAt || '').toLocaleDateString()}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
                    <p className="py-2 text-gray-900">{new Date(user?.updatedAt || '').toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
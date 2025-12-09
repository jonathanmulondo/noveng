import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, Camera, LogOut, Save, Edit } from 'lucide-react';

export const ProfileSettings: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // User data
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    profilePicture: ''
  });

  useEffect(() => {
    if (user) {
      // Fetch full profile data from backend
      // For now, use basic user data
      setProfileData({
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: '',
        dateOfBirth: '',
        profilePicture: user.profile?.avatar_url || ''
      });
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          profilePicture: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
      // TODO: Upload to Supabase storage in production
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    try {
      // TODO: Implement profile update API endpoint
      setTimeout(() => {
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setMessage('Failed to update profile');
      setLoading(false);
    }
  };

  const getInitials = () => {
    const first = profileData.firstName?.[0] || '';
    const last = profileData.lastName?.[0] || '';
    return (first + last).toUpperCase() || user?.name?.[0]?.toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Profile Settings
            </h1>
            <p className="text-neutral-600 mt-1">Manage your account information</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
          >
            <LogOut size={18} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-purple-100">

          {/* Profile Picture Section */}
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-8 pb-8 border-b border-neutral-200">
            <div className="relative group">
              {profileData.profilePicture ? (
                <img
                  src={profileData.profilePicture}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover ring-4 ring-purple-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold ring-4 ring-purple-100">
                  {getInitials()}
                </div>
              )}

              {/* Upload Button Overlay */}
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera size={32} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-neutral-900">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-neutral-600">{profileData.email}</p>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl transition-colors"
              >
                <Edit size={16} />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-2xl ${
              message.includes('success')
                ? 'bg-green-50 border-2 border-green-200 text-green-800'
                : 'bg-red-50 border-2 border-red-200 text-red-800'
            }`}>
              {message}
            </div>
          )}

          {/* Profile Information Form */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-neutral-800 mb-4">Personal Information</h3>

            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-3 bg-neutral-50 border-2 border-neutral-200 rounded-2xl transition-all ${
                      isEditing ? 'focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100' : 'cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-3 bg-neutral-50 border-2 border-neutral-200 rounded-2xl transition-all ${
                      isEditing ? 'focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100' : 'cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="w-full pl-12 pr-4 py-3 bg-neutral-100 border-2 border-neutral-200 rounded-2xl cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-neutral-500 mt-1">Email cannot be changed</p>
            </div>

            {/* Phone & Date of Birth */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={!isEditing}
                    placeholder="+1 (555) 000-0000"
                    className={`w-full pl-12 pr-4 py-3 bg-neutral-50 border-2 border-neutral-200 rounded-2xl transition-all ${
                      isEditing ? 'focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100' : 'cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                    disabled={!isEditing}
                    max={new Date().toISOString().split('T')[0]}
                    className={`w-full pl-12 pr-4 py-3 bg-neutral-50 border-2 border-neutral-200 rounded-2xl transition-all ${
                      isEditing ? 'focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100' : 'cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-2xl hover:from-purple-700 hover:to-pink-600 disabled:opacity-50 transition-all shadow-lg"
                >
                  <Save size={20} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Account Stats Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-purple-100">
          <h3 className="text-xl font-bold text-neutral-800 mb-6">Learning Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-2xl">
              <div className="text-3xl font-bold text-purple-600">{user?.profile?.level || 1}</div>
              <div className="text-sm text-neutral-600 mt-1">Level</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-2xl">
              <div className="text-3xl font-bold text-blue-600">{user?.profile?.current_xp || 0}</div>
              <div className="text-sm text-neutral-600 mt-1">XP</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-2xl">
              <div className="text-3xl font-bold text-green-600">{user?.profile?.streak_days || 0}</div>
              <div className="text-sm text-neutral-600 mt-1">Day Streak</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-2xl">
              <div className="text-3xl font-bold text-orange-600">{user?.profile?.total_learning_hours?.toFixed(1) || '0.0'}h</div>
              <div className="text-sm text-neutral-600 mt-1">Total Hours</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

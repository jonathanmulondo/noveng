import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Modules } from './pages/Modules';
import { ModuleDetail } from './pages/ModuleDetail';
import { Simulator } from './pages/Simulator';
import { Feed } from './pages/Feed';
import { Profile } from './pages/Profile';
import { Novie } from './pages/Novie';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ProfileSettings } from './pages/ProfileSettings';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="courses" element={<Modules />} />
            <Route path="module/:id" element={<ModuleDetail />} />
            <Route path="simulator" element={<Simulator />} />
            <Route path="feed" element={<Feed />} />
            <Route path="novie" element={<Novie />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<ProfileSettings />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
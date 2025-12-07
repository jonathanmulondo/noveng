import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Modules } from './pages/Modules';
import { ModuleDetail } from './pages/ModuleDetail';
import { Simulator } from './pages/Simulator';
import { Feed } from './pages/Feed';
import { Profile } from './pages/Profile';
import { Novie } from './pages/Novie';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<Modules />} />
          <Route path="module/:id" element={<ModuleDetail />} />
          <Route path="simulator" element={<Simulator />} />
          <Route path="feed" element={<Feed />} />
          <Route path="novie" element={<Novie />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
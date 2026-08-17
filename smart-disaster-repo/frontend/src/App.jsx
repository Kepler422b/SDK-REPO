import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import UploadReport from './pages/UploadReport';
import SearchReports from './pages/SearchReports';
import CompareReports from './pages/CompareReports';
import ReportDetails from './pages/ReportDetails';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadReport />} />
          <Route path="/search" element={<SearchReports />} />
          <Route path="/compare" element={<CompareReports />} />
          <Route path="/report/:id" element={<ReportDetails />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

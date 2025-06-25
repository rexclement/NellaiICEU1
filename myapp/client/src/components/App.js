import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar.js';
import './App.css';
import Sidebar from './sidebar.js';
import Evangelism from './Event.js';
import FellowshipEvent from './Fellowshipevents.js';
import MissionEvent from './Missionevents.js';
import Document from './Document.js';
import TeamManager from './Members.js';
import HomePage from './home.js';
import Footer from './Footer.js';
import Welcome from './Welcome.js';
import ProtectedRoute from './ProtectedRoute.js';
import PrayerCellManager from './Prayer_cells.js';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div className="whole-content">
        <div className="sidebarss">
          <Sidebar />
        </div>
        <div className="content">{children}</div>
      </div>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/welcome" element={<Welcome />} /> */}

        <Route
          path="/welcome"
          element={
            <ProtectedRoute>
              <Layout><Welcome /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/members"
          element={
            <ProtectedRoute>
              <Layout><TeamManager /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/event"
          element={
            <Layout>
                <Evangelism />
                <FellowshipEvent />
                <MissionEvent />
            </Layout>
          }
        />
        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <Layout><Document /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/prayer-cell"
          element={
            <ProtectedRoute>
              <Layout><PrayerCellManager /></Layout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

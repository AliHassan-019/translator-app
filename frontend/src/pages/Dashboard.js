// frontend/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { FaUsers, FaUserShield } from 'react-icons/fa';
import UserList from '../components/UserList';
import axiosInstance from '../api/axiosConfig';
import OpenAiSettings from './OpenAiSettings'; // Import the new component

const Dashboard = () => {
  const [activePage, setActivePage] = useState("users");
  const [userCount, setUserCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);

  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        const response = await axiosInstance.get('/admin/users');
        const allUsers = response.data;
        const totalUsers = allUsers.filter(user => user.role === 'user').length;
        const totalAdmins = allUsers.filter(user => user.role === 'admin').length;

        setUserCount(totalUsers);
        setAdminCount(totalAdmins);
      } catch (error) {
        console.error("Error fetching user counts:", error);
      }
    };
    // Only fetch counts if we're on a page that needs them.
    // (Alternatively, you could always fetch, but it’s unnecessary for the openai page.)
    if (activePage !== 'openai') {
      fetchUserCounts();
    }
  }, [activePage]);

  return (
    <div className="dashboard-container">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
      <div className="dashboard-content">
        {/* Show different headings depending on the active page */}
        {activePage === "openai" ? (
          <>
            <h1>OpenAI API Settings</h1>
            <OpenAiSettings />
          </>
        ) : (
          <>
            <h1>Dashboard</h1>

            {/* Stats grid: only shown if active page is not "openai" */}
            <div className="stats-grid" style={{ marginBottom: '20px' }}>
              {/* Users Card */}
              <div
                className="stats-card"
                style={{ cursor: 'pointer' }}
                onClick={() => setActivePage("users")}
              >
                <div className="stats-icon purple-bg">
                  <FaUsers />
                </div>
                <div className="stats-text">
                  <h3>{userCount}</h3>
                  <span>Users</span>
                </div>
              </div>
              {/* Admins Card */}
              <div
                className="stats-card"
                style={{ cursor: 'pointer' }}
                onClick={() => setActivePage("admins")}
              >
                <div className="stats-icon pink-bg">
                  <FaUserShield />
                </div>
                <div className="stats-text">
                  <h3>{adminCount}</h3>
                  <span>Admins</span>
                </div>
              </div>
            </div>

            {/* Render the user list for "users" or "admins" */}
            {activePage === "users" && (
              <>
                <h2>All Registered Users</h2>
                <UserList activeCard="users" />
              </>
            )}
            {activePage === "admins" && (
              <>
                <h2>Admin Users</h2>
                <UserList activeCard="admins" />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

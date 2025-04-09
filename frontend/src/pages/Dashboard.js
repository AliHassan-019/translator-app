import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosConfig';
import Sidebar from '../components/Sidebar';
import { FaUsers, FaUserShield } from 'react-icons/fa'; // Icons for card visuals
import UserList from '../components/UserList';

const Dashboard = () => {
  // activeCard: "users" shows all users; "admins" shows only admin users.
  const [activeCard, setActiveCard] = useState("users");
  
  // State for maintaining user counts (all and admin)
  const [userCount, setUserCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);

  // Fetch users to compute counts, so we use them in our cards
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/admin/users');
        const allUsers = response.data;
        const totalUsers = allUsers.filter(u => u.role === 'user').length;
        const totalAdmins = allUsers.filter(u => u.role === 'admin').length;
        setUserCount(totalUsers);
        setAdminCount(totalAdmins);
      } catch (error) {
        console.error("Error fetching user counts:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h1>Dashboard</h1>
        {/* Stats Cards Container */}
        <div className="stats-grid" style={{ marginBottom: '20px' }}>
          {/* Users Card */}
          <div
            className="stats-card"
            style={{ cursor: 'pointer' }}
            onClick={() => setActiveCard("users")}
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
            onClick={() => setActiveCard("admins")}
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

        {/* Heading to indicate current view */}
        {activeCard === "users" ? (
          <h2>All Registered Users</h2>
        ) : (
          <h2>Admin Users</h2>
        )}

        {/* Render UserList with activeCard prop */}
        <UserList activeCard={activeCard} />
      </div>
    </div>
  );
};

export default Dashboard;

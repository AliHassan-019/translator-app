import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { FaUsers, FaUserShield } from 'react-icons/fa'; // Icons for user/admin cards
import UserList from '../components/UserList'; // Your component to show user list
import axiosInstance from '../api/axiosConfig'; // To fetch the user counts

const Dashboard = () => {
  const [activePage, setActivePage] = useState("users"); // Keeps track of the active page (users or admins)
  const [userCount, setUserCount] = useState(0); // To store total users count
  const [adminCount, setAdminCount] = useState(0); // To store total admins count

  // Fetch user counts when component mounts
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
    fetchUserCounts();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Pass setActivePage as a prop to Sidebar */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
      <div className="dashboard-content">
        <h1>Dashboard</h1>
        {/* Stats Cards Container */}
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

        {/* Heading to indicate current view */}
        {activePage === "users" ? (
          <h2>All Registered Users</h2>
        ) : (
          <h2>Admin Users</h2>
        )}

        {/* Render UserList with activePage prop */}
        <UserList activeCard={activePage} />
      </div>
    </div>
  );
};

export default Dashboard;

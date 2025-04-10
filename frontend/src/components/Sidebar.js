// frontend/components/Sidebar.js
import React from 'react';

const Sidebar = ({ activePage, setActivePage }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      <ul className="sidebar-menu">
        <li 
          className={activePage === 'users' ? 'active' : ''}
          onClick={() => setActivePage('users')}
        >
          User Management
        </li>
        {/* New list item for OpenAI settings */}
        <li 
          className={activePage === 'openai' ? 'active' : ''}
          onClick={() => setActivePage('openai')}
        >
          OpenAI Settings
        </li>
      </ul>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;

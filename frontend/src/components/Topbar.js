import React from 'react';
import { FaSearch, FaBell } from 'react-icons/fa'; // optional icons
// Install react-icons if needed: npm install react-icons

const Topbar = () => {
  return (
    <div className="topbar">
      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Search" />
      </div>
      <div className="actions">
        <FaBell className="bell-icon" />
        <div className="avatar">
          <img
            src="https://i.pravatar.cc/40"  // placeholder user avatar
            alt="User Avatar"
          />
        </div>
      </div>
    </div>
  );
};

export default Topbar;

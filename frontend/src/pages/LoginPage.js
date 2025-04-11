// frontend/src/pages/LoginPage.js
import React, { useState } from 'react';
import axiosInstance from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleToggleShowPassword = () => setShowPassword(prev => !prev);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/auth/login', { username, password });
      // Although the backend now enforces the admin check,
      // we add a redundant check here for added safety.
      if (response.data.user.role !== 'admin') {
         setErrorMsg('Access denied: Only admin accounts can log in.');
         return;
      }
      // Save token and user info to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (error) {
      setErrorMsg('Invalid credentials or server error.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        {errorMsg && <p className="error-message">{errorMsg}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="username" className="login-label">Username</label>
            <input
              type="text"
              id="username"
              className="login-input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password" className="login-label">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="login-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="password-toggle" onClick={handleToggleShowPassword}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <button type="submit" className="login-button">Log In</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

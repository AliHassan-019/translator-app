// frontend/pages/OpenAiSettings.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';
import './OpenAiSettings.css';  // import a CSS file if you prefer

const OpenAiSettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [newApiKey, setNewApiKey] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await axiosInstance.get('/settings/openai');
        setApiKey(response.data.openaiApiKey);
        setNewApiKey(response.data.openaiApiKey);
      } catch (error) {
        setMessage('Error fetching API key');
      }
    };
    fetchApiKey();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.patch('/settings/openai', { newApiKey });
      setApiKey(response.data.openaiApiKey);
      setMessage('API key updated successfully!');
    } catch (error) {
      setMessage('Error updating API key');
    }
  };

  return (
    <div className="openai-settings-container">
      {message && <p className="openai-message">{message}</p>}

      <form onSubmit={handleUpdate} className="openai-form">
        <label htmlFor="newApiKey">New API Key:</label>
        <input
          id="newApiKey"
          type="text"
          value={newApiKey}
          onChange={(e) => setNewApiKey(e.target.value)}
          className="openai-input"
          placeholder="Enter new OpenAI API Key"
        />
        <button type="submit" className="openai-btn">Update API Key</button>
      </form>

      <div className="api-key-display">
        <strong>Current API Key:</strong>
        <div className="api-key-box">
          {apiKey}
        </div>
      </div>
    </div>
  );
};

export default OpenAiSettings;

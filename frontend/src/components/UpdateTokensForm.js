import React, { useState } from 'react';
import axiosInstance from '../api/axiosConfig';

const UpdateTokensForm = ({ userId, onUpdate }) => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.patch(`/admin/users/${userId}`, { amount: parseInt(amount, 10) });
      onUpdate(response.data);
      setMessage('Tokens updated successfully.');
      setAmount('');
    } catch (error) {
      setMessage('Error updating tokens.');
    }
  };

  return (
    <form onSubmit={handleUpdate} className="update-tokens-form">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter token change"
        required
      />
      <button type="submit">Update</button>
      {message && <p className="form-message">{message}</p>}
    </form>
  );
};

export default UpdateTokensForm;

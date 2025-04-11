// frontend/src/components/UserList.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosConfig';
import UpdateTokensForm from './UpdateTokensForm';

const UserList = ({ activeCard }) => {
  const [users, setUsers] = useState([]);
  const [fetchError, setFetchError] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/admin/users');
        setUsers(response.data);
      } catch (error) {
        setFetchError('Failed to fetch users.');
      }
    };
    fetchUsers();
  }, []);

  // Filter for "admins" or "users"
  const filteredUsers =
    activeCard === 'admins'
      ? users.filter(user => user.role === 'admin')
      : users.filter(user => user.role !== 'admin');

  const handleTokenUpdate = (updatedUser) => {
    setUsers(prevUsers =>
      prevUsers.map(user => (user._id === updatedUser._id ? updatedUser : user))
    );
    setEditingUserId(null);
  };

  return (
    <div className="user-list">
      {fetchError && <p className="error-message">{fetchError}</p>}
      {filteredUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table>
          <thead>
            {activeCard === 'admins' ? (
              <tr>
                <th>Name</th>
                <th>Role</th>
              </tr>
            ) : (
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Token Balance</th>
                <th>Total Tokens Consumed</th>
                <th>Actions</th>
              </tr>
            )}
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.role}</td>
                {activeCard !== 'admins' && (
                  <>
                    <td style={{ fontWeight: 'bold', color: '#2a9d8f' }}>
                      {user.tokenBalance}
                    </td>
                    <td>
                      {user.totalTokensConsumed !== undefined
                        ? user.totalTokensConsumed
                        : 'Loading...'}
                    </td>
                    <td>
                      {editingUserId === user._id ? (
                        <UpdateTokensForm
                          userId={user._id}
                          onUpdate={handleTokenUpdate}
                        />
                      ) : (
                        <button
                          onClick={() => setEditingUserId(user._id)}
                          style={{
                            background: '#2f3e46',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Edit Tokens
                        </button>
                      )}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;

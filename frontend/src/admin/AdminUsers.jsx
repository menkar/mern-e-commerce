import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/v1/auth/users', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    };
    fetchUsers();
  }, [user]);

  return (
    <div className="admin-page">
      <div className="admin-page-inner">
        <Link to="/admin" className="admin-back-link">← Back to Dashboard</Link>

        <div className="admin-toolbar">
          <div className="admin-toolbar__left">
            <h2>User Directory</h2>
            <p className="admin-toolbar__subtitle">
              {users.length} registered user{users.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="admin-empty">
            <p className="admin-empty__title">No users found</p>
            <p>Registered users will be listed here.</p>
          </div>
        ) : (
          <div className="admin-table-section">
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td data-label="ID" className="admin-table__id">{u._id.substring(0, 8)}...</td>
                      <td data-label="Name" className="admin-table__name">{u.name}</td>
                      <td data-label="Email">{u.email}</td>
                      <td data-label="Role">
                        <span className={`role-badge ${u.role === 'admin' ? 'role-badge--admin' : 'role-badge--user'}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td data-label="Joined">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;

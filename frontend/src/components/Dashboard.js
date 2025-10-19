import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to ResQueAid, {user?.name}! 👋</h1>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}</p>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="dashboard-header">
        <h2>🎉 Your account is set up!</h2>
        <p style={{ marginTop: '15px', lineHeight: '1.6' }}>
          You have successfully registered and logged into ResQueAid. Your credentials are securely
          stored in MongoDB with password encryption using bcrypt. 
        </p>
        <p style={{ marginTop: '10px', lineHeight: '1.6' }}>
          This is your dashboard where you can access disaster relief features, coordinate with
          volunteers, and manage emergency responses.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;


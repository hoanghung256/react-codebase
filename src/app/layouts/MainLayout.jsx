import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './MainLayout.css';

const MainLayout = () => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, token } = useSelector((state) => state.auth || {});

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = {
    interviewee: [
      { label: 'Explore', path: '/' },
      { label: 'My Bookings', path: '/bookings' },
      { label: 'Messages', path: '/messages' },
      { label: 'Profile', path: '/profile' },
    ],
    interviewer: [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Availability', path: '/availability' },
      { label: 'Bookings', path: '/bookings' },
      { label: 'Messages', path: '/messages' },
    ],
    admin: [
      { label: 'Dashboard', path: '/admin' },
      { label: 'Users', path: '/admin/users' },
      { label: 'Reports', path: '/admin/reports' },
    ],
  };

  const userRole = String(userData?.role || 'interviewee').toLowerCase();
  const currentMenuItems = menuItems[userRole] || menuItems.interviewee;

  const isMenuItemActive = (path) => location.pathname === path;

  return (
    <div className="main-layout">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-logo">
            <h1>intervu</h1>
          </div>

          {/* Navigation Menu */}
          <div className="navbar-menu">
            {currentMenuItems.map((item) => (
              <button
                key={item.label}
                className={`nav-item ${isMenuItemActive(item.path) ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Section */}
          <div className="navbar-right">
            {/* Search Bar */}
            <div className="search-container">
              <svg
                className="search-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search..."
              />
            </div>

            {/* Upgrade Button */}
            {userRole === 'interviewee' && (
              <button className="upgrade-btn">Upgrade Pro</button>
            )}

            {/* Notification Icon */}
            <button className="navbar-icon-btn" title="Notifications">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            {/* User Avatar Dropdown */}
            <div className="user-dropdown">
              <button
                className="navbar-avatar-btn"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                title="Account"
              >
                {userData?.profilePicture ? (
                  <img
                    src={userData.profilePicture}
                    alt="User Avatar"
                    className="avatar-img"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {userData?.fullName
                      ?.split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase() || 'U'}
                  </div>
                )}
              </button>

              {isUserDropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <p className="dropdown-name">{userData?.fullName}</p>
                    <p className="dropdown-email">{userData?.email}</p>
                  </div>
                  <hr className="dropdown-divider" />
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      navigate('/profile');
                      setIsUserDropdownOpen(false);
                    }}
                  >
                    View Profile
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      navigate('/settings');
                      setIsUserDropdownOpen(false);
                    }}
                  >
                    Settings
                  </button>
                  <button className="dropdown-item">Help & Support</button>
                  <hr className="dropdown-divider" />
                  <button
                    className="dropdown-item logout-item"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <p>&copy; 2024 Intervu. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;

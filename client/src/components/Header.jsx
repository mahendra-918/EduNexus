import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <Link to="/" style={logoStyle}>EduNexus</Link>
        <nav>
          <ul style={navStyle}>
            <li><Link to="/courses" style={linkStyle}>Courses</Link></li>
            {user ? (
              <>
                <li><Link to="/chat" style={linkStyle}>Chat</Link></li> {/* Add this line */}
                {(user.role === 'instructor' || user.role === 'admin') && (
                  <li>
                    <Link to="/create-course" style={linkStyle}>Create Course</Link>
                  </li>
                )}
                <li style={linkStyle}>{user.name}</li>
                <li>
                  <button onClick={onLogout} style={logoutButtonStyle}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" style={linkStyle}>Login</Link></li>
                <li><Link to="/register" style={linkStyle}>Register</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>

  );
};

// ... (Keep all the style objects the same)

const headerStyle = {
  background: '#fff',
  color: '#333',
  padding: '1rem 0',
  borderBottom: '1px solid #ddd',
};

const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const logoStyle = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#007bff',
};

const navStyle = {
  display: 'flex',
  listStyle: 'none',
  alignItems: 'center',
};

const linkStyle = {
  marginLeft: '1.5rem',
  fontWeight: '500',
  cursor: 'pointer',
};

const logoutButtonStyle = {
  marginLeft: '1.5rem',
  fontWeight: '500',
  background: 'transparent',
  border: 'none',
  color: '#dc3545',
  cursor: 'pointer',
  fontSize: '1rem',
};

export default Header;
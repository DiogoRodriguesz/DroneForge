import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import {jwtDecode} from 'jwt-decode'; // Correct import
import './EditProfile.css';
import profileImage from '../../assets/Avatars/pastel-blue.png';
import { Eye, EyeSlash } from 'react-bootstrap-icons'; // Import Eye icons

const EditProfile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          setUsername(decodedToken.username);
          setEmail(decodedToken.email);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/users/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        alert('Profile updated successfully');
      } else {
        const data = await response.json();
        alert(data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="editprofile-container">
      <div className="editprofile-background-overlay"></div>
      <Sidebar />
      <div className="editprofile-main-content">
        <h2 className="editprofile-title">Edit Profile</h2>
        <div className="editprofile-form-container">
          <div className="editprofile-image-container">
            <img src={profileImage} alt="Profile" className="editprofile-image" />
          </div>
          <form className="editprofile-form">
            <div className="editprofile-form-group">
              <label htmlFor="edit-username">Username</label>
              <input
                type="text"
                id="edit-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="editprofile-form-control"
              />
            </div>
            <div className="editprofile-form-group">
              <label htmlFor="edit-email">Email</label>
              <input
                type="email"
                id="edit-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="editprofile-form-control"
              />
            </div>
            <div className="editprofile-form-group">
              <label htmlFor="edit-password">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="edit-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="editprofile-form-control"
              />
              <div className="editprofile-password-toggle-icon" onClick={togglePasswordVisibility}>
                {showPassword ? <EyeSlash /> : <Eye />}
              </div>
            </div>
            <button type="button" className="editprofile-update-button" onClick={handleUpdateProfile}>
              Update Profile
            </button>
            <p className="editprofile-logout-text" onClick={handleLogout}>
              Logout
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

// frontend/components/Profile.jsx

import { useState, useEffect } from 'react';
import styles from '../styles/Profile.module.css';
import axios from 'axios';


const Profile = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    username: '',
    email: '',
    bio: '',
    twitter: '',
    linkedin: '',
    profilePicture: ''
  });
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/users/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Adjust as per your auth implementation
          }
        });
        setUser(response.data.user);
        setForm({
          username: response.data.user.username || '',
          email: response.data.user.email || '',
          bio: response.data.user.bio || '',
          twitter: response.data.user.socialLinks?.twitter || '',
          linkedin: response.data.user.socialLinks?.linkedin || '',
          profilePicture: response.data.user.profilePicture || ''
        });
      } catch (error) {
        console.error('Error fetching profile:', error.response?.data?.message || error.message);
      }
    };

    fetchProfile();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccessMessage('');

    // Prepare the payload
    const payload = {
      username: form.username || undefined,
      email: form.email || undefined,
      bio: form.bio || undefined,
      socialLinks: {
        twitter: form.twitter || undefined,
        linkedin: form.linkedin || undefined
      },
      profilePicture: form.profilePicture || undefined
    };

    try {
      const response = await axios.put('/api/users/profile', payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` // Adjust as per your auth implementation
        }
      });
      setSuccessMessage(response.data.message);
      setUser(response.data.user);
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors([{ msg: error.response?.data?.message || 'An error occurred.' }]);
      }
    }
  };

  if (!user) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.title}>Your Profile</h2>
      {successMessage && <div className={styles.success}>{successMessage}</div>}
      {errors.length > 0 && (
        <div className={styles.errorContainer}>
          {errors.map((error, index) => (
            <div key={index} className={styles.error}>
              {error.msg}
            </div>
          ))}
        </div>
      )}
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Username */}
        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.label}>Username</label>
          <input
            type="text"
            id="username"
            name="username"
            className={styles.input}
            value={form.username}
            onChange={handleChange}
            placeholder="Enter your username"
          />
        </div>

        {/* Email */}
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className={styles.input}
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>

        {/* Bio */}
        <div className={styles.formGroup}>
          <label htmlFor="bio" className={styles.label}>Bio</label>
          <textarea
            id="bio"
            name="bio"
            className={styles.textarea}
            value={form.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself"
            maxLength="500"
          ></textarea>
        </div>

        {/* Social Links */}
        <div className={styles.formGroup}>
          <label htmlFor="twitter" className={styles.label}>Twitter URL</label>
          <input
            type="url"
            id="twitter"
            name="twitter"
            className={styles.input}
            value={form.twitter}
            onChange={handleChange}
            placeholder="https://twitter.com/yourprofile"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="linkedin" className={styles.label}>LinkedIn URL</label>
          <input
            type="url"
            id="linkedin"
            name="linkedin"
            className={styles.input}
            value={form.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        {/* Profile Picture */}
        <div className={styles.formGroup}>
          <label htmlFor="profilePicture" className={styles.label}>Profile Picture URL</label>
          <input
            type="url"
            id="profilePicture"
            name="profilePicture"
            className={styles.input}
            value={form.profilePicture}
            onChange={handleChange}
            placeholder="https://example.com/profile.jpg"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className={styles.button}>Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;

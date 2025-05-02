import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChangePasswordBack = () => {
    const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordHint, setShowPasswordHint] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
    
    // Only show hint for newPassword field when it has value and doesn't meet requirements
    if (name === 'newPassword') {
      setShowPasswordHint(value.length > 0 && !validatePassword(value));
    }
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!validatePassword(inputs.newPassword)) {
      setIsLoading(false);
      setMessage('Password must meet all requirements');
      setIsError(true);
      return;
    }

    try {
      const response = await axios.patch(
        'http://localhost:3000/api/auth/changePassword',
        inputs,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setMessage(response.data.message || 'Password changed successfully!');
      setIsError(false);
      setInputs({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordHint(false);
      navigate('/dashboard');

    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to change password');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <div className="app-content pt-3 p-md-3 p-lg-4">
        <div className="container-xl">
          <div style={styles.container}>
            <div style={styles.card}>
              <div style={styles.header}>
                <h2 style={styles.heading}>Change Password</h2>
                <div style={styles.logo}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" 
                          stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
  
              {message && (
                <div style={{ ...styles.alert, ...(isError ? styles.alertError : styles.alertSuccess) }}>
                  {message}
                </div>
              )}
  
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={inputs.currentPassword}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    placeholder="Enter current password"
                  />
                </div>
  
                <div style={styles.inputGroup}>
                  <label style={styles.label}>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={inputs.newPassword}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    placeholder="Enter new password"
                  />
                  {showPasswordHint && (
                    <div style={styles.hint}>
                      Must contain 8+ characters with uppercase, lowercase, number, and special character
                    </div>
                  )}
                </div>
  
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={inputs.confirmPassword}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    placeholder="Confirm new password"
                  />
                </div>
  
                <button 
                  type="submit" 
                  disabled={isLoading}
                  style={isLoading ? styles.buttonDisabled : styles.button}
                >
                  {isLoading ? (
                    <>
                      <span style={styles.spinner}></span>
                      Processing...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    padding: '32px',
    width: '100%',
    maxWidth: '450px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  heading: {
    color: '#2E7D32',
    fontSize: '24px',
    fontWeight: '600',
    margin: 0
  },
  logo: {
    backgroundColor: '#E8F5E9',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    color: '#2E7D32',
    fontSize: '14px',
    fontWeight: '500'
  },
  input: {
    padding: '12px 16px',
    border: '1px solid #C8E6C9',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s',
    backgroundColor: '#F1F8E9',
    color: '#33691E'
  },
  inputFocus: {
    borderColor: '#4CAF50',
    boxShadow: '0 0 0 2px rgba(76, 175, 80, 0.2)'
  },
  hint: {
    fontSize: '12px',
    color: '#689F38',
    marginTop: '4px'
  },
  button: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    marginTop: '8px'
  },
  buttonDisabled: {
    backgroundColor: '#A5D6A7',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'not-allowed',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    marginTop: '8px'
  },
  spinner: {
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    width: '16px',
    height: '16px',
    animation: 'spin 1s linear infinite'
  },
  alert: {
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px'
  },
  alertSuccess: {
    backgroundColor: '#E8F5E9',
    color: '#2E7D32',
    borderLeft: '4px solid #4CAF50'
  },
  alertError: {
    backgroundColor: '#FFEBEE',
    color: '#C62828',
    borderLeft: '4px solid #F44336'
  }
};

export default ChangePasswordBack;
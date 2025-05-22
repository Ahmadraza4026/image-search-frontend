import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import apiClient from '../../api/apiClient';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const VerifyEmail = () => {
  const query = useQuery();
  const token = query.get('token');
  const [message, setMessage] = useState('Verifying...');

  useEffect(() => {
    const verify = async () => {
      try {
        await apiClient.get(`/auth/verify-email?token=${token}`);
        setMessage('Email verified successfully. You can now log in.');
      } catch (err) {
        console.error('Verification error:', err);
        setMessage('Invalid or expired verification link. Please try again.');
      }
    };

    if (token) verify();
    else setMessage('Invalid verification link.');
  }, [token]);

  return <div className="message">{message}</div>;
};

export default VerifyEmail;

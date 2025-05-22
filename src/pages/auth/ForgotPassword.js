import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import apiClient from '../../api/apiClient';

const ForgotPassword = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      return setError('Please enter your email address.');
    }

    try {
      setLoading(true);
      const res = await apiClient.post('/auth/forgot-password', { email });
      setMessage(res.data.message || 'If this email is registered, you will receive password reset instructions.');
    } catch (err) {
      console.error('Forgot password error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: theme.palette.background.default,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          width: '100%',
          p: 4,
          borderRadius: 2,
          boxShadow: theme.shadows[3],
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h4" component="h1" mb={3} color="text.primary" align="center">
          Forgot Password
        </Typography>
        <Typography variant="body2" mb={3} color="text.secondary" align="center">
          Enter your email address and we'll send you instructions to reset your password.
        </Typography>
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            margin="normal"
            autoComplete="email"
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {message && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, py: 1.5, fontWeight: 'bold' }}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Email'}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default ForgotPassword;

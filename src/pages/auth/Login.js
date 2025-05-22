import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import apiClient from '../../api/apiClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      return setError('Please enter both email and password.');
    }

    try {
      const res = await apiClient.post('/auth/login', { email, password });
      const { accessToken, refreshToken } = res.data;

      const success = await login(accessToken, refreshToken);
      if (success) {
        navigate('/account');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      const serverError =
        err.response?.data?.errors?.[0]?.msg || err.response?.data?.message;
      setError(serverError || 'Login failed');
    }
  };

  const toggleShowPassword = () => setShowPassword((show) => !show);

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
        <Typography
          variant="h4"
          component="h1"
          mb={3}
          color="text.primary"
          align="center"
        >
          Login
        </Typography>
        <form onSubmit={handleLogin} noValidate>
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
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            margin="normal"
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleShowPassword}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="body2" align="right" sx={{ mt: 1 }}>
            <Link
              href="/forgot-password"
              underline="hover"
              sx={{ fontWeight: 'bold', cursor: 'pointer' }}
            >
              Forgot password?
            </Link>
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, py: 1.5, fontWeight: 'bold' }}
          >
            Login
          </Button>
        </form>

        <Typography variant="body2" align="center" sx={{ mt: 3, color: 'text.secondary' }}>
          Not registered yet?{' '}
          <Link
            href="/register"
            underline="hover"
            sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}
          >
            Register now
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Box } from '@mui/material';

export default function Layout() {
  return (
    <>
      <Navbar />
      <Box
        component="main"
        sx={{
          bgcolor: 'background.default',
          color: 'text.primary',
          padding: '2rem 1rem',
          maxWidth: 1280,
          margin: '0 auto',
          minHeight: 'calc(100vh - 64px)', // Adjust if Navbar height differs
          transition: 'background-color 0.3s ease, color 0.3s ease',
        }}
      >
        <Outlet />
      </Box>
    </>
  );
}

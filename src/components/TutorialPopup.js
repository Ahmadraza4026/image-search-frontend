// src/components/TutorialPopup.js
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const TutorialPopup = ({ onClose }) => {
  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="tutorial-dialog-title"
    >
      <DialogTitle
        id="tutorial-dialog-title"
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        Welcome to Image Search!
        <IconButton onClick={onClose} aria-label="close" size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          Here’s a quick guide to get you started:
        </Typography>
        <Typography component="ul" sx={{ pl: 2 }}>
          <li>Use the trending keywords above or the search bar to find amazing images.</li>
          <li>Click on any image to see details and related images.</li>
          <li>Favorite images by clicking the heart icon — your favorites are saved for later.</li>
          <li>Use the light/dark mode toggle in the navbar to switch themes.</li>
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Enjoy exploring beautiful photos!
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Got it!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TutorialPopup;

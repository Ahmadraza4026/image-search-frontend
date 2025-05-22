import React, { useState, useEffect } from 'react';
import {
  TextField,
  InputAdornment,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getTrendingKeywords } from '../api/trendingKeywords';

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState('');
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load trending keywords once
  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      try {
        const res = await getTrendingKeywords();
        setOptions(res.data.keywords || []);
      } catch (err) {
        console.error('Failed to load trending keywords:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  // Trigger search with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(value);
    }, 300);
    return () => clearTimeout(handler);
  }, [value, onSearch]);

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      freeSolo
      options={options}
      inputValue={value}
      onInputChange={(event, newInputValue) => setValue(newInputValue)}
      onChange={(event, newValue) => {
        if (newValue) {
          setValue(newValue);
          onSearch(newValue);
        }
      }}
      loading={loading}
      sx={{ mt: 4, mb: 4, maxWidth: 600, width: '100%' }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder="Search Unsplash..."
          fullWidth
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? <CircularProgress size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}

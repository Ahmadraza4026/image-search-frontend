import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Typography,
  Container,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Grid,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import unsplashApi from '../api/unsplash';
import apiClient from '../api/apiClient'; // your axios instance for backend
import { AnimatePresence, motion } from 'framer-motion';
import ImageCard from '../components/ImageCard';
import SearchBar from '../components/SearchBar';

function ImageGrid({ images, lastImageRef, onToggleFavorite, favoriteIds, isVideo }) {
  return (
    <Grid container spacing={3}>
      <AnimatePresence>
        {images.map((img, index) => {
          const isLast = index === images.length - 1;

          return (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={img.id}
              ref={isLast ? lastImageRef : null}
              component={motion.div}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <ImageCard
                image={img}
                isVideo={isVideo}
                isFavorite={favoriteIds.includes(img.id)}
                onToggleFavorite={() => onToggleFavorite(img)}
              />
            </Grid>
          );
        })}
      </AnimatePresence>
    </Grid>
  );
}

function Search() {
  const theme = useTheme();

  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState('images'); // 'images' or 'videos'
  const [orientation, setOrientation] = useState('all');
  const [color, setColor] = useState('all');
  const [resolution, setResolution] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState([]);

  const observer = useRef();

  // Fetch favorites on mount
  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await apiClient.get('/favorites');
        setFavoriteIds(res.data.favorites.map((fav) => fav.imageId));
      } catch (err) {
        console.error('Failed to load favorites', err);
      }
    }
    fetchFavorites();
  }, []);

  // fetchImages now takes pageToFetch and reset params explicitly
  const fetchImages = useCallback(
    async (pageToFetch, reset = false) => {
      if (!query.trim()) return;

      setLoading(true);
      setError(null);

      try {
        let results = [];
        if (searchType === 'images') {
          const response = await unsplashApi.get('/search/photos', {
            params: {
              query,
              per_page: 12,
              page: pageToFetch,
              orientation: orientation !== 'all' ? orientation : undefined,
              color: color !== 'all' ? color : undefined,
              width: resolution || undefined,
            },
          });
          results = response.data.results;
        } else {
          const response = await apiClient.get('/pexels/videos/search', {
            params: {
              query,
              per_page: 12,
              page: pageToFetch,
            },
          });
          results = response.data.videos || [];
        }

        if (reset) {
          setImages(results);
        } else {
          setImages((prev) => [...prev, ...results]);
        }

        setHasMore(results.length === 12);
        if (results.length === 0 && reset) {
          setError('No results found. Try different keywords.');
        }
      } catch (err) {
        setError('Failed to fetch results.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [query, searchType, orientation, color, resolution]
  );

  // Reset page and fetch new data when query or filters change
  useEffect(() => {
    if (query.trim()) {
      setPage(1);
      fetchImages(1, true);
    } else {
      setImages([]);
      setHasMore(false);
    }
  }, [query, searchType, orientation, color, resolution, fetchImages]);

  // Intersection observer for infinite scroll
  const lastImageRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            fetchImages(nextPage, false);
            return nextPage;
          });
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchImages]
  );

  const handleSearchTypeChange = (event, newType) => {
    if (newType !== null) {
      setSearchType(newType);
      setImages([]);
      setPage(1);
    }
  };

  const handleToggleFavorite = async (img) => {
    if (favoriteIds.includes(img.id)) {
      try {
        await apiClient.delete(`/favorites/${img.id}`);
        setFavoriteIds((prev) => prev.filter((id) => id !== img.id));
      } catch (err) {
        console.error('Failed to remove favorite', err);
      }
    } else {
      try {
        await apiClient.post('/favorites', {
          imageId: img.id,
          imageData: img,
        });
        setFavoriteIds((prev) => [...prev, img.id]);
      } catch (err) {
        console.error('Failed to add favorite', err);
      }
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        padding: '3rem 1rem',
        backgroundColor: 'background.default',
        borderRadius: '10px',
        color: 'text.primary',
        minHeight: '100vh',
      }}
    >
      <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 700, color: 'text.primary' }}>
        Search for {searchType === 'images' ? 'Images' : 'Videos'}
      </Typography>

      <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center" mb={3}>
        <SearchBar onSearch={setQuery} />

        <ToggleButtonGroup
          value={searchType}
          exclusive
          onChange={handleSearchTypeChange}
          aria-label="search type"
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: '25px',
            padding: '0.3rem',
            mb: 3,
          }}
        >
          <ToggleButton value="images" aria-label="images" sx={{ padding: '1rem 2rem', borderRadius: '25px' }}>
            Images
          </ToggleButton>
          <ToggleButton value="videos" aria-label="videos" sx={{ padding: '1rem 2rem', borderRadius: '25px' }}>
            Videos
          </ToggleButton>
        </ToggleButtonGroup>

        <Box display="flex" justifyContent="center" gap={2} mb={3} flexWrap="wrap">
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Orientation</InputLabel>
            <Select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value)}
              label="Orientation"
              sx={{ backgroundColor: 'background.paper', borderRadius: 1 }}
              disabled={searchType === 'videos'}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="landscape">Landscape</MenuItem>
              <MenuItem value="portrait">Portrait</MenuItem>
              <MenuItem value="squarish">Square</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Color</InputLabel>
            <Select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              label="Color"
              sx={{ backgroundColor: 'background.paper', borderRadius: 1 }}
              disabled={searchType === 'videos'}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="black_and_white">Black & White</MenuItem>
              <MenuItem value="yellow">Yellow</MenuItem>
              <MenuItem value="blue">Blue</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Min Width (px)</InputLabel>
            <Select
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              label="Min Width (px)"
              sx={{ backgroundColor: 'background.paper', borderRadius: 1 }}
              disabled={searchType === 'videos'}
            >
              <MenuItem value="">Any</MenuItem>
              <MenuItem value="1920">1920</MenuItem>
              <MenuItem value="3840">3840</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {error && (
        <Typography variant="body1" color="error" align="center" my={2}>
          {error}
        </Typography>
      )}

      <ImageGrid
        key={`${query}-${searchType}`}
        images={images}
        lastImageRef={lastImageRef}
        onToggleFavorite={handleToggleFavorite}
        favoriteIds={favoriteIds}
        isVideo={searchType === 'videos'}
      />

      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress color="primary" />
        </Box>
      )}
    </Container>
  );
}

export default Search;

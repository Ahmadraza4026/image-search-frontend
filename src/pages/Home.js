import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Chip,
  IconButton,
  Box,
  useTheme,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import { getTrendingPhotos } from '../api/unsplash';
import axios from 'axios';
import { useFavorites } from '../context/FavoritesContext';
import TutorialPopup from '../components/TutorialPopup';  // <-- Import TutorialPopup

// Normalize image object to expected format
const normalizeImage = (img) => ({
  id: img.id || img._id || Math.random().toString(36).substr(2, 9),
  alt_description: img.alt_description || img.alt || 'Untitled',
  urls: {
    small:
      (img.urls && img.urls.small) ||
      (img.src && img.src.medium) ||
      img.image ||
      '',
    regular:
      (img.urls && img.urls.regular) ||
      (img.src && img.src.large) ||
      img.image ||
      '',
  },
  user: {
    name: (img.user && img.user.name) || img.photographer || 'Unknown',
  },
});

const Home = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendingKeywords, setTrendingKeywords] = useState([]);
  const [showTutorial, setShowTutorial] = useState(false); // tutorial popup visibility

  const navigate = useNavigate();
  const theme = useTheme();
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const response = await getTrendingPhotos();
        setImages(response.data);
      } catch (error) {
        console.error('Failed to fetch trending images:', error);
      } finally {
        setLoading(false);
      }
    };

    const loadTrendingKeywords = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/trending-keywords');
        setTrendingKeywords(res.data.keywords || []);
      } catch (err) {
        console.error('Failed to load trending keywords:', err);
      }
    };

    loadTrending();
    loadTrendingKeywords();

    // Show tutorial popup only if NOT already shown before
    if (!localStorage.getItem('tutorialShown')) {
      setShowTutorial(true);
    }
  }, []);

  const handleKeywordClick = (keyword) => {
    navigate(`/search?query=${encodeURIComponent(keyword)}`);
  };

  const isFavorited = (img) =>
    favorites.some((fav) => fav.imageId === normalizeImage(img).id);

  const handleToggleFavorite = (img) => {
    const normalized = normalizeImage(img);
    toggleFavorite(normalized);
  };

  // When user closes tutorial popup, hide it and set localStorage flag
  const handleCloseTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('tutorialShown', 'true');
  };

  // Define chip colors depending on theme mode
  const chipBgColor = theme.palette.mode === 'dark'
    ? '#7c6e8a'
    : 'rgba(20, 20, 20, 0.7)';

  const chipTextColor = theme.palette.mode === 'dark' ? '#fff' : '#ddd';

  return (
    <Container sx={{ py: 8 }}>
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{
          fontWeight: 700,
          color: '#3a3a3a',
          mb: 4,
        }}
      >
        Explore Trending Images
      </Typography>

      {/* Trending Keywords */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        {trendingKeywords.map((keyword) => (
          <Chip
            key={keyword}
            label={keyword}
            clickable
            onClick={() => handleKeywordClick(keyword)}
            sx={{
              m: 0.5,
              px: 2,
              py: 0.5,
              backgroundColor: chipBgColor,
              color: chipTextColor,
              fontWeight: 500,
              borderRadius: 2,
              '&:hover': {
                backgroundColor:
                  theme.palette.mode === 'dark' ? '#695d75' : 'rgba(20, 20, 20, 0.85)',
              },
              cursor: 'pointer',
              userSelect: 'none',
            }}
          />
        ))}
      </Box>

      {/* Search Button */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Button
          variant="contained"
          onClick={() => navigate('/search')}
          sx={{
            backgroundColor: '#7c6e8a',
            color: '#fff',
            px: 4,
            py: 1.5,
            borderRadius: 3,
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#695d75',
            },
          }}
        >
          Start Searching
        </Button>
      </Box>

      {/* Trending Images Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {images.map((img) => {
            const normalized = normalizeImage(img);
            const favorited = isFavorited(normalized);

            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={normalized.id}
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 2,
                }}
              >
                <Box
                  component="img"
                  src={normalized.urls.small}
                  alt={normalized.alt_description}
                  onClick={() => navigate(`/image/${normalized.id}`)}
                  sx={{
                    width: '100%',
                    height: 240,
                    objectFit: 'cover',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />
                <IconButton
                  onClick={() => handleToggleFavorite(normalized)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: favorited ? 'red' : 'white',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    },
                  }}
                  aria-label={
                    favorited ? 'Remove from favorites' : 'Add to favorites'
                  }
                >
                  {favorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Tutorial Popup rendered conditionally */}
      {showTutorial && <TutorialPopup onClose={handleCloseTutorial} />}
    </Container>
  );
};

export default Home;

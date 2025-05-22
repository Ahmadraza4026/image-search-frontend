import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useFavorites } from '../context/FavoritesContext';

export default function Favorites() {
  const { favorites, loading, error, toggleFavorite } = useFavorites();

  if (loading)
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box textAlign="center" mt={5}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  // Optional: debug favorites data
  // console.log('Favorites:', favorites);

  return (
    <Box textAlign="center" mt={5} px={2}>
      <Typography variant="h4" gutterBottom>
        Your Favorite Media
      </Typography>

      {favorites.length === 0 ? (
        <Typography variant="body1" color="text.secondary" mt={3}>
          You have no favorites yet.
        </Typography>
      ) : (
        <Grid container spacing={4} mt={3}>
          {favorites.map((fav) => {
            const media = fav.media || {};
            if (!media.type) return null; // skip favorites with no media info

            return (
              <Grid item xs={12} sm={6} md={4} key={fav._id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s ease',
                    '&:hover': { transform: 'scale(1.03)' },
                  }}
                >
                  {media.type === 'image' ? (
                    <CardMedia
                      component="img"
                      alt={media.alt_description || 'No description'}
                      height="200"
                      image={media.urls?.small || ''}
                      sx={{ borderRadius: '12px 12px 0 0', objectFit: 'cover' }}
                    />
                  ) : media.type === 'video' ? (
                    <video
                      controls
                      width="100%"
                      height="200"
                      style={{ borderRadius: '12px 12px 0 0', objectFit: 'cover' }}
                      poster={media.urls?.thumbnail || ''}
                    >
                      <source src={media.urls?.video_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : null}

                  <CardContent>
                    <Typography variant="h6" noWrap>
                      {media.alt_description || 'No description'}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      onClick={() => toggleFavorite(media)}
                    >
                      Remove from Favorites
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}

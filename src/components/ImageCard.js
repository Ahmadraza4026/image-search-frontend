import React from 'react';
import { Card, CardMedia, IconButton, useTheme } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useFavorites } from '../context/FavoritesContext';

export default function ImageCard({ image }) {
  const { isFavorited, toggleFavorite } = useFavorites();
  const favorited = isFavorited(image.id);
  const theme = useTheme();

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite(image);
  };

  // Determine if it's an image or video
  const isImage = !!image.urls;
  const isVideo = !!image.video_files;

  // For image src
  const imageSrc = image.urls?.small || image.urls?.regular;

  // For video src (take first video file with mp4)
  const videoSrc = image.video_files?.find((file) => file.file_type === 'video/mp4')?.link || 
                   image.video_files?.[0]?.link;

  return (
    <Card
      sx={{
        position: 'relative',
        borderRadius: 2,
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow:
          theme.palette.mode === 'light'
            ? '0 2px 10px rgba(0, 0, 0, 0.05)'
            : '0 2px 10px rgba(255, 255, 255, 0.05)',
        transition:
          'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow:
            theme.palette.mode === 'light'
              ? '0 8px 30px rgba(0, 0, 0, 0.15)'
              : '0 8px 30px rgba(255, 255, 255, 0.15)',
        },
      }}
    >
      {isImage && (
        <CardMedia
          component="img"
          height="200"
          image={imageSrc}
          alt={image.alt_description || 'Image'}
          sx={{ borderRadius: '10px 10px 0 0' }}
        />
      )}

      {isVideo && videoSrc && (
        <CardMedia
          component="video"
          height="200"
          controls
          src={videoSrc}
          sx={{ borderRadius: '10px 10px 0 0', objectFit: 'cover' }}
        />
      )}

      <IconButton
        onClick={handleToggleFavorite}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: favorited ? theme.palette.error.main : theme.palette.common.white,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          transition: 'color 0.3s ease, background-color 0.3s ease',
        }}
        aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        {favorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Card>
  );
}

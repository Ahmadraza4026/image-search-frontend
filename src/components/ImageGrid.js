import React from 'react';
import { Grid, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../context/FavoritesContext';

export default function ImageGrid({ images, lastImageRef, isVideo, uniqueKey }) {
  const { favoriteIds, toggleFavorite, toggling } = useFavorites();

  return (
    <Grid container spacing={2} key={uniqueKey /* force remount on key change */}>
      <AnimatePresence>
        {images.map((item, index) => {
          const isFavorited = favoriteIds.includes(item.id);
          const refProp = index === images.length - 1 ? { ref: lastImageRef } : {};

          const motionStyle = {
            position: 'relative',
            borderRadius: 8,
            overflow: 'hidden',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            backgroundColor: '#fff',
          };

          if (isVideo) {
            const videoFile =
              item.video_files?.find((file) => file.quality === 'sd' && file.file_type === 'video/mp4') ||
              item.video_files?.[0];

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.id} {...refProp}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={motionStyle}
                  layout
                  key={item.id}
                >
                  <video
                    width="100%"
                    height={180}
                    controls
                    src={videoFile?.link}
                    poster={item.image}
                    style={{ borderRadius: 8, objectFit: 'cover' }}
                  />
                  <IconButton
                    onClick={() => toggleFavorite(item)}
                    color={isFavorited ? 'error' : 'default'}
                    disabled={toggling}
                    style={{ position: 'absolute', top: 10, right: 10 }}
                  >
                    {isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                </motion.div>
              </Grid>
            );
          }

          const imageUrl = item.urls?.regular || item.url || item.src?.medium || '';

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id} {...refProp}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={motionStyle}
                layout
                key={item.id}
              >
                <img
                  src={imageUrl}
                  alt={item.alt_description || 'Image'}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: 180,
                    objectFit: 'cover',
                    borderRadius: 8,
                  }}
                />
                <IconButton
                  onClick={() => toggleFavorite(item)}
                  color={isFavorited ? 'error' : 'default'}
                  disabled={toggling}
                  style={{ position: 'absolute', top: 10, right: 10 }}
                >
                  {isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </motion.div>
            </Grid>
          );
        })}
      </AnimatePresence>
    </Grid>
  );
}
    
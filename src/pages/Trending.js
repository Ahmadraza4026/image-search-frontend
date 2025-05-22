import { useEffect, useState } from 'react';
import { getTrendingPhotos } from '../api/unsplash';
import ImageGrid from '../components/ImageGrid';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Typography, Box, CircularProgress, Fab } from '@mui/material';
import { ArrowUpward } from '@mui/icons-material';
import apiClient from '../api/apiClient';

export default function Trending() {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await apiClient.get('/favorites');
        setFavoriteIds(res.data.favorites.map((fav) => fav.imageId));
      } catch (err) {
        console.error('Failed to load favorites', err);
      }
    };
    fetchFavorites();
  }, []);

  const fetchPhotos = async () => {
    try {
      const res = await getTrendingPhotos(page, 15);
      const newPhotos = res.data;
      setPhotos((prev) => [...prev, ...newPhotos]);
      if (newPhotos.length < 15) setHasMore(false);
    } catch (err) {
      console.error('Failed to fetch trending photos:', err);
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowScrollToTop(true);
    } else {
      setShowScrollToTop(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <Box
      sx={{
        pt: 10,
        px: 2,
        textAlign: 'center',
        minHeight: '100dvh', // use dynamic viewport height
        overflowX: 'hidden', // prevent horizontal overflow causing flicker
      }}
    >
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        Trending Images
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Explore the most popular pictures trending now.
      </Typography>

      <InfiniteScroll
        dataLength={photos.length}
        next={() => setPage((prev) => prev + 1)}
        hasMore={hasMore}
        loader={
          <Box textAlign="center" mt={3}>
            <CircularProgress />
          </Box>
        }
        endMessage={
          <Typography align="center" color="text.secondary" mt={4}>
            No more trending images to load.
          </Typography>
        }
      >
        <ImageGrid
          images={photos}
          onToggleFavorite={handleToggleFavorite}
          favoriteIds={favoriteIds}
          isVideo={false}
          // Removed key prop to prevent full rerender flicker
        />
      </InfiniteScroll>

      {showScrollToTop && (
        <Fab
          color="primary"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000,
          }}
          aria-label="Scroll to top"
        >
          <ArrowUpward />
        </Fab>
      )}
    </Box>
  );
}

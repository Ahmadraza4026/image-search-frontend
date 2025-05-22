import apiClient from './apiClient';

// Get all favorites for the logged-in user
export const fetchFavorites = async () => {
  const response = await apiClient.get('/favorites');
  return response.data; // array of favorites
};

// Add a favorite — expects the full media object with type ('image' or 'video')
export const addFavorite = async (media) => {
  if (!media || !media.id || !media.type) {
    throw new Error('Invalid media object passed to addFavorite');
  }

  // Prepare payload to match backend shape
  const payload = {
    imageId: media.id,
    media: {
      type: media.type,
      alt_description: media.alt || media.alt_description || '',
      urls: {
        small: media.src?.medium || media.urls?.small || '',
        regular: media.src?.large || media.urls?.regular || '',
        thumbnail: media.thumbnail || '', // for video thumbnail if available
        video_url: media.video_url || '', // for video playback url if available
      },
      user: {
        name: media.photographer || media.user?.name || 'Unknown',
      },
    },
  };

  const response = await apiClient.post('/favorites', payload);
  return response.data;
};

// Remove favorite by favorite _id
export const removeFavorite = async (favoriteId) => {
  const response = await apiClient.delete(`/favorites/${favoriteId}`);
  return response.data;
};

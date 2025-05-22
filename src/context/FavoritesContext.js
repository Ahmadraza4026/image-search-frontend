import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';
import {
  fetchFavorites,
  addFavorite,
  removeFavorite,
} from '../api/favoritesApi';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toggling, setToggling] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const data = await fetchFavorites();
        setFavorites(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load favorites.');
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  const favoriteIds = favorites.map((fav) => fav.imageId);

  const isFavorited = (imageId) => favoriteIds.includes(imageId);

  // Normalize media for frontend use (image or video)
  const normalizeMedia = (media) => {
    if (!media) return null;

    if (media.type === 'image') {
      return {
        id: media.id,
        type: 'image',
        alt_description: media.alt_description || '',
        urls: {
          small: media.urls?.small || '',
          regular: media.urls?.regular || '',
        },
        user: {
          name: media.user?.name || 'Unknown',
        },
      };
    }

    if (media.type === 'video') {
      return {
        id: media.id,
        type: 'video',
        alt_description: media.alt_description || '',
        urls: {
          thumbnail: media.urls?.thumbnail || '',
          video_url: media.urls?.video_url || '',
        },
        user: {
          name: media.user?.name || 'Unknown',
        },
      };
    }

    return null;
  };

  const toggleFavorite = async (media) => {
    if (!user) {
      toast.info('Please login to save favorites');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
      return;
    }

    setToggling(true);
    try {
      const existing = favorites.find((f) => f.imageId === media.id);
      if (existing) {
        await removeFavorite(existing._id);
        setFavorites((prev) => prev.filter((f) => f._id !== existing._id));
      } else {
        // media must have type either 'image' or 'video'
        const normalized = {
          ...media,
          type: media.type || 'image',
          alt_description: media.alt || media.alt_description || '',
          urls: media.urls || {},
          user: media.user || {},
        };
        const newFav = await addFavorite(normalized);
        setFavorites((prev) => [...prev, newFav]);
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      setError('Failed to toggle favorite');
    } finally {
      setToggling(false);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteIds,
        loading,
        toggling,
        error,
        toggleFavorite,
        isFavorited,
        normalizeMedia,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);

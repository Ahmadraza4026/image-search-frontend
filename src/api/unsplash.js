import axios from 'axios';

const BASE_URL = 'https://api.unsplash.com';
const ACCESS_KEY = 'hj_A9PJjbMX0UZDDzWCjKhpMno1NwYlZQwwhE1KKhic';

const unsplashApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Client-ID ${ACCESS_KEY}`,
  },
});

export const searchPhotos = (query, page = 1, perPage = 12, options = {}) =>
  unsplashApi.get('/search/photos', {
    params: {
      query,
      page,
      per_page: perPage,
      orientation: options.orientation || undefined,
      color: options.color || undefined,
      ...options.extraParams,
    },
  });

export const searchVideos = (query, page = 1, perPage = 12, options = {}) =>
  unsplashApi.get('/search/videos', {
    params: {
      query,
      page,
      per_page: perPage,
      ...options.extraParams,
    },
  });

// NEW: Fetch trending photos
export const getTrendingPhotos = (page = 1, perPage = 15) =>
  unsplashApi.get('/photos', {
    params: {
      page,
      per_page: perPage,
      order_by: 'popular',
    },
  });

export default unsplashApi;

// src/api/videoApi.js
import axios from 'axios';

const PEXELS_API_KEY = 'xgUobqYQDZiuYKiTWxJ9aWPLhMbHcfk1bjFh1rHZWoNMjmsgs9JLHivv'; // Replace this with your real key

const pexelsApi = axios.create({
  baseURL: 'https://api.pexels.com/videos',
  headers: {
    Authorization: PEXELS_API_KEY,
  },
});

export const searchVideos = (query, page = 1, perPage = 12) =>
  pexelsApi.get('/search', {
    params: { query, page, per_page: perPage },
  });

export default pexelsApi;

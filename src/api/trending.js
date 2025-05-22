import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

export const fetchTrendingKeywords = async () => {
  const res = await axios.get(`${API_BASE}/trending-keywords`);
  return res.data.keywords || [];
};

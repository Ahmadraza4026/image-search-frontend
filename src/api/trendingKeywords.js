import apiClient from './apiClient';

export const getTrendingKeywords = () => apiClient.get('/trending-keywords');

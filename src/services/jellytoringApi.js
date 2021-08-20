import axios from 'axios';
import cookieService from './cookieService';

export const jellytoringApi = axios.create({
  // PRODUCTION:
  baseURL: ''
  // LOCAL:
  // baseURL: 'http://localhost:5000'
});

jellytoringApi.interceptors.request.use(function (config) {
  const token = cookieService.getCookie("token");
  config.headers.Authorization =  token ? `Bearer ${token}` : '';
  return config;
});

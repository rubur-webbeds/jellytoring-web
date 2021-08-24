import axios from 'axios';
import cookieService from './cookieService';

export let jellytoringApi = axios.create({
  // PRODUCTION:
  // baseURL: ''
  // LOCAL:
  baseURL: 'http://localhost:5000'
});

if (process.env.NODE_ENV == 'development') {
  jellytoringApi = axios.create({
    baseURL: 'http://localhost:5000'
  });
}



jellytoringApi.interceptors.request.use(function (config) {
  const token = cookieService.getCookie("token");
  config.headers.Authorization =  token ? `Bearer ${token}` : '';
  return config;
});

import axios from 'axios';

export const jellytoringApi = axios.create({
  baseURL: `https://localhost:5001/`
})
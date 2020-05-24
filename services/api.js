import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.0.0.70:8087',
});

export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: 'https://z51vzfpvoj.execute-api.sa-east-1.amazonaws.com/dev/icode',
});

export default api;

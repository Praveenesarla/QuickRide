import axios from 'axios';

const BASE_URL =
  'https://quick-service-server-1036279390366.asia-south1.run.app';

console.log('prod url', BASE_URL);

export const APIClient = axios.create({
  baseURL: `${BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Encoding': 'gzip',
  },
});

import axios from 'axios';

const BASE_URL =
  'https://bd97-2401-4900-1cab-5750-75f6-b5b7-8f-13a0.ngrok-free.app';

console.log('prod url', BASE_URL);

export const APIClient = axios.create({
  baseURL: `${BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Encoding': 'gzip',
  },
});

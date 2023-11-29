import axios from 'axios';

import { API_URL } from '@/constants/App';

const instance = axios.create();

instance.interceptors.request.use(
  (config) => {
    return {
      ...config,
      baseURL: config.baseURL || API_URL,
    };
  },
  (error) => Promise.reject(error)
);

export default instance;

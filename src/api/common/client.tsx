import axios from 'axios';

import { Env } from '@/lib/env';

const client = axios.create();

client.interceptors.request.use(
  (config) => ({
    ...config,
    baseURL: config.baseURL || Env.API_URL,
  }),
  (error) => Promise.reject(error),
);

export { client };

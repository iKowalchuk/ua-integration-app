import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { MyCar } from './types';

type Response = MyCar[];
type Variables = { apiURL: string; token: string };

export const useMyCars = createQuery<Response, Variables, AxiosError>({
  queryKey: ['guestCars'],
  fetcher: (variables) =>
    client.post(
      '/api/ios.php',
      {
        token: variables.token,
        cmd: '',
      },
      { baseURL: variables.apiURL },
    ),
});

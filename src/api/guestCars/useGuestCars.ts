import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { GuestCar } from './types';

type Response = GuestCar[];
type Variables = { apiURL: string; token: string };

export const useGuestCars = createQuery<Response, Variables, AxiosError>({
  queryKey: ['guestCars'],
  fetcher: (variables) =>
    client
      .post(
        '/api/ios.php',
        {
          token: variables.token,
          cmd: 'cmd_list_invite',
        },
        { baseURL: variables.apiURL },
      )
      .then((response) => response.data?.cmd_result || [])
      .then((response) => {
        return response.map((item: any) => ({
          id: item.id,
          carNumber: item.descr_guest,
          actualDate: item.dt_actual.date,
        }));
      }),
});

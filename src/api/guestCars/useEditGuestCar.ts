import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';

type Response = void;
type Variables = {
  apiURL: string;
  token: string;
  payload: {
    carId: string;
    carNumber: string;
    hours: number;
  };
};

export const useEditGuestCar = createMutation<Response, Variables, AxiosError>({
  mutationFn: (variables) =>
    client
      .post(
        '/api/ios.php',
        {
          token: variables.token,
          cmd: 'cmd_edit_invite',
          id_invite: variables.payload.carId,
          p_car_num: variables.payload.carNumber,
          p_hours: variables.payload.hours,
        },
        { baseURL: variables.apiURL },
      )
      .then((_response) => {}),
});

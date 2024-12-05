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
  };
};

export const useDeleteMyCar = createMutation<Response, Variables, AxiosError>({
  mutationFn: (variables) =>
    client
      .post(
        '/api/ios.php',
        {
          token: variables.token,
          cmd: 'cmd_delete_auto_user',
          num_auto: variables.payload.carNumber,
        },
        { baseURL: variables.apiURL },
      )
      .then((response) => response.data?.cmd_result || [])
      .then((response) => response[0])
      .then((response) => {
        if (response.result_status === 1) {
          throw new Error();
        }
      }),
});

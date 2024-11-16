import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';

type Response = void;
type Variables = {
  apiURL: string;
  token: string;
  payload: {
    carNumber: string;
    description: string;
  };
};

export const useAddMyCar = createMutation<Response, Variables, AxiosError>({
  mutationFn: (variables) =>
    client
      .post(
        '/api/ios.php',
        {
          token: variables.token,
          cmd: 'cmd_edit_auto_user',
          num_auto: variables.payload.carNumber,
          descr_auto: variables.payload.description,
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

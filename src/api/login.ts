import { isEmpty } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import api from './api';

type Login = {
  token: string;
};

const login = async ({
  apiURL,
  login,
  password,
}: {
  apiURL: string;
  login: string;
  password: string;
}): Promise<Login> => {
  const token = uuidv4();

  const { data } = await api.post(
    '/api/ios.php',
    {
      login,
      password,
      token,
    },
    { baseURL: apiURL }
  );

  if (isEmpty(data) || isEmpty(data.DETAIL_USER)) {
    throw new Error();
  }

  return { token };
};

export default login;

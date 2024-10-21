import { client } from '@/api';

const logout = async (payload: {
  apiURL: string;
  token: string;
}): Promise<void> => {
  await client.post(
    '/api/ios.php',
    {
      token: payload.token,
      cmd: 'user_user_del_key',
    },
    { baseURL: payload.apiURL },
  );
};

export default logout;

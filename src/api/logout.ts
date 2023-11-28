import api from './api';

const logout = async ({
  apiURL,
  token,
}: {
  apiURL: string;
  token: string;
}): Promise<void> => {
  await api.post(
    '/api/ios.php',
    {
      cmd: 'user_user_del_key',
      token,
    },
    { baseURL: apiURL }
  );
};

export default logout;

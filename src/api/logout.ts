import api from './api';

const logout = async (payload: {
  apiURL: string;
  token: string;
}): Promise<void> => {
  await api.post(
    '/api/ios.php',
    {
      cmd: 'user_user_del_key',
      token: payload.token,
    },
    { baseURL: payload.apiURL }
  );
};

export default logout;

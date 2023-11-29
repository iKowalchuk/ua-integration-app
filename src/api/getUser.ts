import api from './api';

export type User = {
  name: string;
  houseName: string;
};

const getUser = async ({
  apiURL,
  token,
}: {
  apiURL: string;
  token: string;
}): Promise<User> => {
  const { data } = await api.post(
    '/api/ios.php',
    {
      cmd: 'user_get_key',
      token,
    },
    { baseURL: apiURL }
  );

  const res = data.DETAIL_USER;

  return {
    name: res.descr,
    houseName: res.name_house,
  };
};

export default getUser;

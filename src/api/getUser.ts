import api from './api';

export type User = {
  id: number;
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

  const res: any = data?.DETAIL_USER || {};

  return {
    id: res.id_users,
    name: res.descr,
    houseName: res.name_house,
  };
};

export default getUser;

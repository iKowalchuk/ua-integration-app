import { client } from '@/api';

export type User = {
  id: number;
  name: string;
  houseName: string;
};

const getUser = async (payload: {
  apiURL: string;
  token: string;
}): Promise<User> => {
  const { data } = await client.post(
    '/api/ios.php',
    {
      token: payload.token,
      cmd: 'user_get_key',
    },
    { baseURL: payload.apiURL },
  );

  const res: any = data?.DETAIL_USER || {};

  return {
    id: res.id_users,
    name: res.descr,
    houseName: res.name_house,
  };
};

export default getUser;

import { client } from '@/api';

export type Control = {
  id: number;
  name: string;
  groupName: string;
  command: string;
};

const getControls = async (payload: {
  apiURL: string;
  token: string;
}): Promise<Control[]> => {
  const { data } = await client.post(
    '/api/ios.php',
    {
      token: payload.token,
      cmd: 'get_my_menu',
    },
    { baseURL: payload.apiURL },
  );

  const res: any[] = data?.cmd_result || [];

  return res.map((res: any) => ({
    id: res.id_access,
    name: res.descr,
    groupName: res.name_group,
    command: res.p_cmd_in,
  }));
};

export default getControls;

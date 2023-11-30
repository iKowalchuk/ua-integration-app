import api from './api';

export type Control = {
  id: number;
  name: string;
  groupName: string;
  command: string;
};

const getControls = async ({
  apiURL,
  token,
}: {
  apiURL: string;
  token: string;
}): Promise<Control[]> => {
  const { data } = await api.post(
    '/api/ios.php',
    {
      cmd: 'get_my_menu',
      token,
    },
    { baseURL: apiURL }
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

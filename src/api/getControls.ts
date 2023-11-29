import api from './api';

export type Control = {
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

  return data.cmd_result.map((res: any) => ({
    name: res.descr,
    groupName: res.name_group,
    command: res.p_cmd_in,
  }));
};

export default getControls;

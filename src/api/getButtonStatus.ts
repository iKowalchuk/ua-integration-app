import { client } from '@/api';

export type ButtonStatus = 'online' | 'offline' | 'opening';

const parseStatus = (status: string): any => {
  try {
    return JSON.parse(status);
  } catch {
    return {};
  }
};

const transformButtonStatus = (status: string): ButtonStatus => {
  if (status === '') {
    return 'online';
  }

  const parsedStatus = parseStatus(status);

  if (parsedStatus?.text === 'Відкриття') {
    return 'opening';
  }

  return 'offline';
};

const getButtonStatus = async (payload: {
  apiURL: string;
  token: string;
  command: string;
}): Promise<ButtonStatus> => {
  const { data } = await client.post(
    '/api/ios.php',
    {
      token: payload.token,
      cmd: 'get_status_button',
      p_cmd_in: payload.command,
    },
    { baseURL: payload.apiURL },
  );

  const res: string = data?.cmd_result[0]?.status || '';

  return transformButtonStatus(res);
};

export default getButtonStatus;

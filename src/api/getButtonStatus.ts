import api from './api';

import validateAndConvertResponse from '@/utils/validateAndConvertResponse';

export type ButtonStatus = 'online' | 'offline' | 'open';

const parseStatus = (status: string): any => {
  try {
    return JSON.parse(status);
  } catch {
    return {};
  }
};

const transformButtonStatus = (data: { status: string }): ButtonStatus => {
  if (data?.status === '') {
    return 'online';
  }

  const parsedStatus = parseStatus(data.status);

  if (parsedStatus?.text === 'Відкриття') {
    return 'open';
  }

  return 'offline';
};

const getButtonStatus = async ({
  apiURL,
  token,
  command,
}: {
  apiURL: string;
  token: string;
  command: string;
}): Promise<ButtonStatus> => {
  const { data } = await api.post(
    '/api/ios.php',
    {
      cmd: 'get_status_button',
      p_cmd_in: command,
      token,
    },
    { baseURL: apiURL }
  );

  const res = validateAndConvertResponse(data);

  return transformButtonStatus(res.cmdResult[0]);
};

export default getButtonStatus;

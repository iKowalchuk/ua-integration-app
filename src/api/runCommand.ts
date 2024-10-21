import { client } from '@/api';

const runCommand = async (payload: {
  apiURL: string;
  token: string;
  command: string;
}): Promise<void> => {
  await client.post(
    '/api/ios.php',
    {
      token: payload.token,
      cmd: 'run_cmd',
      name_cmd: payload.command,
    },
    { baseURL: payload.apiURL },
  );
};

export default runCommand;

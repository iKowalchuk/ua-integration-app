import api from './api';

const runCommand = async ({
  apiURL,
  token,
  command,
}: {
  apiURL: string;
  token: string;
  command: string;
}): Promise<void> => {
  await api.post(
    '/api/ios.php',
    {
      cmd: 'run_cmd',
      name_cmd: command,
      token,
    },
    { baseURL: apiURL }
  );
};

export default runCommand;

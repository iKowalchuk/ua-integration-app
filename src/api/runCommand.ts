import api from './api';

const runCommand = async (payload: {
  apiURL: string;
  token: string;
  command: string;
}): Promise<void> => {
  await api.post(
    '/api/ios.php',
    {
      cmd: 'run_cmd',
      name_cmd: payload.command,
      token: payload.token,
    },
    { baseURL: payload.apiURL }
  );
};

export default runCommand;

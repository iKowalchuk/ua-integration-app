import api from './api';

const runCommand = async ({
  token,
  command,
}: {
  token: string;
  command: string;
}): Promise<void> => {
  await api.post('/api/ios.php', {
    cmd: 'run_cmd',
    name_cmd: command,
    token,
  });
};

export default runCommand;

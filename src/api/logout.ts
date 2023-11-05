import api from './api';

const logout = async ({ token }: { token: string }): Promise<void> => {
  await api.post('/api/ios.php', {
    cmd: 'user_user_del_key',
    token,
  });
};

export default logout;

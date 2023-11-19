import api from './api';

import validateAndConvertResponse from '@/utils/validateAndConvertResponse';

export type Menu = {
  accessFixed: number;
  accessRight: number;
  created: {
    date: string;
    timezoneType: number;
    timezone: string;
  };
  descr: string;
  descrFull: string;
  idAccess: number;
  idHouse: number;
  nameGroup: string;
  nameMenuTbot: string;
  pCmdIn: string;
  pCmdSend: string;
  pDeviceNameIn: string;
  pDeviceNameSend: string;
  pPhoneIn: string;
  sort: number;
};

const getMenu = async ({ token }: { token: string }): Promise<Menu[]> => {
  const { data } = await api.post('/api/ios.php', {
    cmd: 'get_my_menu',
    token,
  });

  const res = validateAndConvertResponse(data);

  return res.cmdResult;
};

export default getMenu;

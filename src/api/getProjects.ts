import api from './api';

import validateAndConvertResponse from '@/utils/validateAndConvertResponse';

export type Project = {
  id: number;
  idProject: number;
  name: string;
  urlSite: string;
  urlApiIos: string;
  descr: string;
  detail: string;
  created: {
    date: string;
    timezoneType: number;
    timezone: string;
  };
  disabled: number;
  sort: number;
  tBot: string;
};

const getProjects = async (): Promise<Project[]> => {
  const { data } = await api.post('/api/ios.php', {
    cmd: 'get_all_projects',
  });

  const res = validateAndConvertResponse(data);

  return res.cmdResult;
};

export default getProjects;

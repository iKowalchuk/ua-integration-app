import api from './api';

export type Project = {
  id: number;
  name: string;
  apiURL: string;
};

const getProjects = async (): Promise<Project[]> => {
  const { data } = await api.post('/api/ios.php', {
    cmd: 'get_all_projects',
  });

  return data.cmd_result.map((res: any) => ({
    id: res.id,
    name: res.descr,
    apiURL: res.url_site,
  }));
};

export default getProjects;

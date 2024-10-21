import { client } from '@/api';

export type Project = {
  id: number;
  name: string;
  apiURL: string;
};

const getProjects = async (): Promise<Project[]> => {
  const { data } = await client.post('/api/ios.php', {
    cmd: 'get_all_projects',
  });

  const res: any[] = data?.cmd_result || [];

  return res.map((res: any) => ({
    id: res.id,
    name: res.descr,
    apiURL: res.url_site,
  }));
};

export default getProjects;

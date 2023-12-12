import { create } from 'zustand';

import getProjects, { Project } from '@/api/getProjects';

type State = {
  projects: Project[];
};

type Actions = {
  fetchProjects: () => Promise<void>;
};

const useProjectsStore = create<State & Actions>((set) => ({
  projects: [],
  fetchProjects: async () => {
    const projects = await getProjects();
    set({ projects });
  },
}));

export default useProjectsStore;

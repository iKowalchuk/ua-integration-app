import AsyncStorage from '@react-native-async-storage/async-storage';
import constate from 'constate';
import { useEffect, useState } from 'react';

import { Project } from '@/api/getProjects';
import { PROJECT_KEY } from '@/constants/App';

const useProjects = () => {
  const [project, setProjectState] = useState<Project | null>(null);

  const setProject = async (data: Project) => {
    try {
      setProjectState(data);
      await AsyncStorage.setItem(PROJECT_KEY, JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  };

  const removeProject = async () => {
    try {
      setProjectState(null);
      await AsyncStorage.removeItem(PROJECT_KEY);
    } catch (error) {
      console.error(error);
    }
  };

  const getProjectState = async () => {
    try {
      const projectData = await AsyncStorage.getItem(PROJECT_KEY);
      projectData
        ? await setProject(JSON.parse(projectData))
        : await removeProject();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProjectState();
  }, []);

  return {
    project,
    setProject,
    removeProject,
  } as const;
};

export const [ProjectsProvider, useProjectsContext] = constate(useProjects);

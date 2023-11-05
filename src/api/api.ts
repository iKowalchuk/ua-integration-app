import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { Project } from './getProjects';

import { API_URL, PROJECT_KEY } from '@/constants/App';

const instance = axios.create();

instance.interceptors.request.use(
  async (config) => {
    const projectData = await AsyncStorage.getItem(PROJECT_KEY);
    const project: Project = projectData && JSON.parse(projectData);

    return {
      ...config,
      baseURL: config.baseURL || project?.urlSite || API_URL,
    };
  },
  (error) => Promise.reject(error)
);

export default instance;

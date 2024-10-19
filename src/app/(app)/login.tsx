import { Redirect, useLocalSearchParams } from 'expo-router';

import { type Project } from '@/api/getProjects';
import LoginScreen from '@/screens/LoginScreen';

const Login = () => {
  const { project } = useLocalSearchParams<{ project?: string }>();

  const currentProject = project ? (JSON.parse(project) as Project) : undefined;

  if (!currentProject) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return <LoginScreen project={currentProject} />;
};

export default Login;

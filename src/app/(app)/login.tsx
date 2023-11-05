import { Redirect, useLocalSearchParams } from 'expo-router';

import LoginScreen from '@/screens/LoginScreen';

const Login = () => {
  const { project } = useLocalSearchParams<{ project?: string }>();

  const projectObject = project && JSON.parse(project);

  if (!projectObject) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return <LoginScreen project={projectObject} />;
};

export default Login;

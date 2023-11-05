import { Redirect } from 'expo-router';
import React from 'react';

import { useAuthContext } from '@/hooks/useAuth';
import LoadingScreen from '@/screens/LoadingScreen';

const App = () => {
  const { auth } = useAuthContext();

  if (auth.type === 'unauthorized') {
    return <Redirect href="/(auth)/projects" />;
  }

  if (auth.type === 'authorized') {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return <LoadingScreen />;
};

export default App;

import { Redirect } from 'expo-router';
import React from 'react';

import { useAuthContext } from '@/contexts/AuthContext';
import LoadingScreen from '@/screens/LoadingScreen';

const App = () => {
  const { authState } = useAuthContext();

  if (authState.type === 'unauthenticated') {
    return <Redirect href="/(auth)/projects" />;
  }

  if (authState.type === 'authenticated') {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return <LoadingScreen />;
};

export default App;

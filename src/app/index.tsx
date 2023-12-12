import { Redirect } from 'expo-router';
import React from 'react';

import LoadingView from '@/components/LoadingView';
import { useAuthContext } from '@/contexts/AuthContext';

const App = () => {
  const { authState } = useAuthContext();

  if (authState.type === 'unauthenticated') {
    return <Redirect href="/(auth)/projects" />;
  }

  if (authState.type === 'authenticated') {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return <LoadingView />;
};

export default App;

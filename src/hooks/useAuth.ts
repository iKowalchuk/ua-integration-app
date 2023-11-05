import AsyncStorage from '@react-native-async-storage/async-storage';
import constate from 'constate';
import { useEffect, useState } from 'react';

import { TOKEN_KEY } from '@/constants/App';

type Token = string;

type AuthState =
  | { type: 'initial' }
  | { type: 'authorized'; token: Token }
  | { type: 'unauthorized' };

const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    type: 'initial',
  });

  const setAuth = async (token: string) => {
    try {
      setAuthState({ type: 'authorized', token });
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error(error);
    }
  };

  const removeAuth = async () => {
    try {
      setAuthState({ type: 'unauthorized' });
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error(error);
    }
  };

  const getAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      token ? await setAuth(token) : await removeAuth();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  return {
    auth: authState,
    setAuth,
    removeAuth,
  } as const;
};

export const [AuthProvider, useAuthContext] = constate(useAuth);

import 'react-native-get-random-values';
import 'react-native-reanimated';
import '../i18n';

import { config } from '@gluestack-ui/config';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { AuthProvider } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Inter: require('../../assets/fonts/Inter.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const colorMode = colorScheme === 'dark' ? 'dark' : 'light';
  const navigationTheme = colorMode === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <GluestackUIProvider config={config} colorMode={colorMode}>
      <ThemeProvider value={navigationTheme}>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(app)" />
          </Stack>
        </AuthProvider>
      </ThemeProvider>
    </GluestackUIProvider>
  );
};

export default RootLayout;

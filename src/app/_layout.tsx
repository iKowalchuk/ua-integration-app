import 'react-native-get-random-values';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { config } from '../../gluestack-ui.config';

import { AuthProvider } from '@/hooks/useAuth';
import { ProjectsProvider } from '@/hooks/useProjects';

import '../i18n';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '/index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ProjectsProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ProjectsProvider>
  );
};

const RootLayoutNav = () => {
  const colorScheme = useColorScheme();

  return (
    <GluestackUIProvider
      config={config}
      colorMode={colorScheme === 'dark' ? 'dark' : 'light'}
    >
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
        </Stack>
      </ThemeProvider>
    </GluestackUIProvider>
  );
};

export default RootLayout;

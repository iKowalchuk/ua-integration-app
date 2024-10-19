import { Box, Heading } from '@gluestack-ui/themed';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useRouter } from 'expo-router';
import i18n from 'i18n-js';
import { partition } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import LoadingView from '@/components/LoadingView';
import TabBarLabel from '@/components/TabBarLabel';
import { useAuthContext } from '@/contexts/AuthContext';
import ProjectsList from '@/screens/ProjectsScreen/ProjectsList';
import projectsStore from '@/store/projectsStore';

const Tab = createMaterialTopTabNavigator();

const Projects = () => {
  const { width } = useWindowDimensions();

  const router = useRouter();

  const { authState, sessions, onSessionChange } = useAuthContext();

  const { projects, fetchProjects } = projectsStore(
    useShallow((state) => ({
      projects: state.projects,
      fetchProjects: state.fetchProjects,
    })),
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getProjectsRequest = async () => {
      try {
        setIsLoading(true);
        await fetchProjects();
      } finally {
        setIsLoading(false);
      }
    };

    getProjectsRequest();
  }, []);

  const [authProjectsData, noAuthProjectsData] = partition(projects, (item) =>
    sessions.map((item) => item.projectId).includes(item.id),
  );

  if (isLoading) {
    return <LoadingView />;
  }

  if (authProjectsData.length === 0) {
    return (
      <ProjectsList
        data={projects}
        onPress={(project) => {
          router.push({
            pathname: '/(auth)/login',
            params: { project: JSON.stringify(project) },
          });
        }}
      />
    );
  }

  const AuthProjectsComponent = () => (
    <ProjectsList
      data={authProjectsData}
      onPress={(project) => {
        onSessionChange(project.id);
        router.replace('/(app)/(tabs)');
      }}
    />
  );

  const NoAuthProjectsComponent = () => (
    <ProjectsList
      data={noAuthProjectsData}
      onPress={(project) => {
        router.push({
          pathname:
            authState.type === 'authenticated'
              ? '/(app)/login'
              : '/(auth)/login',
          params: { project: JSON.stringify(project) },
        });
      }}
    />
  );

  return (
    <Tab.Navigator
      initialLayout={{ width }}
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarItemStyle: { width: 'auto' },
      }}
    >
      <Tab.Screen
        name="my"
        options={{
          tabBarLabel: ({ color, focused }) => (
            <TabBarLabel color={color} focused={focused}>
              {i18n.t('projects.my_label')}
            </TabBarLabel>
          ),
        }}
        children={AuthProjectsComponent}
      />
      <Tab.Screen
        name="other"
        options={{
          tabBarLabel: ({ color, focused }) => (
            <TabBarLabel color={color} focused={focused}>
              {i18n.t('projects.other_label')}
            </TabBarLabel>
          ),
        }}
        children={NoAuthProjectsComponent}
      />
    </Tab.Navigator>
  );
};

const ProjectsScreen = () => {
  const { authState } = useAuthContext();

  if (authState.type === 'authenticated') {
    return <Projects />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1}>
        <Box
          borderBottomWidth={1}
          borderColor="$borderLight100"
          px="$4"
          pt="$4"
          pb="$2"
          sx={{
            _dark: { borderColor: '$borderDark900' },
          }}
        >
          <Heading size="lg" color="$primary500">
            {i18n.t('projects.projects_title')}
          </Heading>
          <Heading color="$secondary400" size="xs">
            {i18n.t('projects.select_to_continue_subtitle')}
          </Heading>
        </Box>
        <Projects />
      </Box>
    </SafeAreaView>
  );
};

export default ProjectsScreen;

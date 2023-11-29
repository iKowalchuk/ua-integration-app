import { Box, Heading } from '@gluestack-ui/themed';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useRouter } from 'expo-router';
import i18n from 'i18n-js';
import { partition } from 'lodash';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import getProjects, { Project } from '@/api/getProjects';
import { useAuthContext } from '@/contexts/AuthContext';
import LoadingScreen from '@/screens/LoadingScreen';
import ProjectsList from '@/screens/Projects/ProjectsList';

const Projects = () => {
  const router = useRouter();

  const { sessions, onSessionChange } = useAuthContext();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getProjectsRequest = async () => {
      try {
        setIsLoading(true);
        const data = await getProjects();
        setProjects(data);
      } finally {
        setIsLoading(false);
      }
    };

    getProjectsRequest();
  }, []);

  const [authProjectsData, noAuthProjectsData] = partition(projects, (item) =>
    sessions.map((item) => item.projectId).includes(item.id)
  );

  if (isLoading) {
    return <LoadingScreen />;
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
    <Box mt="$6">
      <ProjectsList
        data={authProjectsData}
        onPress={(project) => {
          onSessionChange(project.id);
          router.replace('/(app)/(tabs)');
        }}
      />
    </Box>
  );

  const NoAuthProjectsComponent = () => (
    <Box mt="$6">
      <ProjectsList
        data={noAuthProjectsData}
        onPress={(project) => {
          router.push({
            pathname: '/(app)/login',
            params: { project: JSON.stringify(project) },
          });
        }}
      />
    </Box>
  );

  const Tab = createMaterialTopTabNavigator();

  return (
    <Tab.Navigator initialRouteName="my">
      <Tab.Screen
        name="my"
        component={AuthProjectsComponent}
        options={{ tabBarLabel: i18n.t('projects.my_label') }}
      />
      <Tab.Screen
        name="other"
        component={NoAuthProjectsComponent}
        options={{ tabBarLabel: i18n.t('projects.other_label') }}
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
        <Box p="$4">
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

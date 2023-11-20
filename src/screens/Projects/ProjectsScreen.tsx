import { Box, Heading } from '@gluestack-ui/themed';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useRouter } from 'expo-router';
import i18n from 'i18n-js';
import { partition } from 'lodash';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import getProjects, { Project } from '@/api/getProjects';
import { useAuthContext } from '@/hooks/useAuth';
import { useProjectsContext } from '@/hooks/useProjects';
import ProjectsList from '@/screens/Projects/ProjectsList';

const Projects = () => {
  const router = useRouter();

  const { project } = useProjectsContext();
  const { auth } = useAuthContext();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getProjectsRequest();
  }, []);

  const getProjectsRequest = async () => {
    try {
      setIsLoading(true);
      const data = await getProjects();
      setProjects(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = (project: Project) => {
    const projectStringify = JSON.stringify(project);

    if (auth.type === 'unauthorized') {
      router.push({
        pathname: '/(auth)/login',
        params: { project: projectStringify },
      });
    }

    if (auth.type === 'authorized') {
      router.push({
        pathname: '/(app)/login',
        params: { project: projectStringify },
      });
    }
  };

  const [authProjectsData, noAuthProjectsData] = partition(
    projects,
    (item) => item.id === project?.id
  );

  if (isLoading) {
    return false;
  }

  if (authProjectsData.length === 0) {
    return <ProjectsList data={projects} onPress={handleClick} />;
  }

  const AuthProjectsComponent = () => (
    <Box mt="$6">
      <ProjectsList data={authProjectsData} onPress={handleClick} />
    </Box>
  );

  const NoAuthProjectsComponent = () => (
    <Box mt="$6">
      <ProjectsList data={noAuthProjectsData} onPress={handleClick} />
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
  const { auth } = useAuthContext();

  if (auth.type === 'authorized') {
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

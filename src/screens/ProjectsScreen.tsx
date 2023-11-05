import { Box, Button, ButtonText, Heading } from '@gluestack-ui/themed';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useRouter } from 'expo-router';
import i18n from 'i18n-js';
import { partition } from 'lodash';
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import getProjects, { Project } from '@/api/getProjects';
import { useAuthContext } from '@/hooks/useAuth';
import { useProjectsContext } from '@/hooks/useProjects';

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

  const handleClick = async (project: Project) => {
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
    return (
      <FlatList
        data={projects}
        renderItem={({ item }) => (
          <Button
            mx="$4"
            mb="$2"
            onPress={() => handleClick(item)}
            isDisabled={item.id === project?.id}
          >
            <ButtonText>{item.descr}</ButtonText>
          </Button>
        )}
        keyExtractor={(item) => item.descr + item.id}
      />
    );
  }

  const AuthProjectsComponent = () => (
    <FlatList
      style={{ marginTop: 20 }}
      data={authProjectsData}
      renderItem={({ item }) => (
        <Button
          mx="$4"
          mb="$2"
          onPress={() => handleClick(item)}
          isDisabled={item.id === project?.id}
        >
          <ButtonText>{item.descr}</ButtonText>
        </Button>
      )}
      keyExtractor={(item) => item.descr + item.id}
    />
  );

  const NoAuthProjectsComponent = () => (
    <FlatList
      style={{ marginTop: 20 }}
      data={noAuthProjectsData}
      renderItem={({ item }) => (
        <Button
          mx="$4"
          mb="$2"
          onPress={() => handleClick(item)}
          isDisabled={item.id === project?.id}
        >
          <ButtonText>{item.descr}</ButtonText>
        </Button>
      )}
      keyExtractor={(item) => item.descr + item.id}
    />
  );

  const Tab = createMaterialTopTabNavigator();

  return (
    <Tab.Navigator>
      <Tab.Screen
        name={i18n.t('projects.my_label')}
        component={AuthProjectsComponent}
      />
      <Tab.Screen
        name={i18n.t('projects.other_label')}
        component={NoAuthProjectsComponent}
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

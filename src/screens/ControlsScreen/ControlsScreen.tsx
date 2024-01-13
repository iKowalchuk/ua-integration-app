import { Center, Text } from '@gluestack-ui/themed';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Stack } from 'expo-router';
import i18n from 'i18n-js';
import React, { useEffect, useMemo, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { Control } from '@/api/getControls';
import LoadingView from '@/components/LoadingView';
import { useAuthContext } from '@/contexts/AuthContext';
import ControlSectionList from '@/screens/ControlsScreen/ControlSectionList';
import useControlsStore from '@/stores/useControlsStore';
import useProjectsStore from '@/stores/useProjectsStore';

const Tab = createMaterialTopTabNavigator();

const ControlsScreen = () => {
  const { width } = useWindowDimensions();

  const { authState } = useAuthContext();

  const { controls, fetchControls, favorites } = useControlsStore(
    useShallow((state) => ({
      controls: state.controls,
      fetchControls: state.fetchControls,
      favorites: state.favorites,
    }))
  );

  const { projects, fetchProjects } = useProjectsStore(
    useShallow((state) => ({
      projects: state.projects,
      fetchProjects: state.fetchProjects,
    }))
  );

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getMenuRequest = async () => {
      if (authState.type !== 'authenticated') {
        return;
      }

      try {
        setIsLoading(true);
        await fetchProjects();
        await fetchControls({
          apiURL: authState.session.apiURL,
          token: authState.session.token,
        });
      } finally {
        setIsLoading(false);
      }
    };

    getMenuRequest();
  }, [authState]);

  const GROUP_FAVORITES = i18n.t('controls.section.favorites');

  const sectionItems = useMemo(() => {
    const entries = Object.entries(
      controls.reduce(
        (acc: { [key: string]: Control[] }, { groupName, ...other }) => {
          return Object.assign(acc, {
            [GROUP_FAVORITES]: [
              ...(acc[GROUP_FAVORITES] || []),
              ...(favorites.includes(other.id)
                ? [{ groupName, ...other }]
                : []),
            ],
            [groupName]: [...(acc[groupName] || []), { groupName, ...other }],
          });
        },
        {}
      )
    );

    return entries.map(([key, value]) => ({ title: key, data: value }));
  }, [controls, favorites]);

  if (isLoading) {
    return <LoadingView />;
  }

  const currentProject = projects.find(
    (item) =>
      authState.type === 'authenticated' &&
      authState.session.projectId === item.id
  );

  return (
    <>
      <Stack.Screen options={{ headerTitle: currentProject?.name }} />

      <Tab.Navigator
        initialLayout={{ width }}
        initialRouteName={
          sectionItems[0].data.length === 0
            ? sectionItems[1].title
            : sectionItems[0].title
        }
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarItemStyle: { width: 'auto' },
        }}
      >
        {sectionItems.map(({ title, data }) => (
          <Tab.Screen
            key={title}
            name={title}
            options={{ tabBarLabel: title }}
            children={() =>
              data.length === 0 && title === GROUP_FAVORITES ? (
                <Center flex={1}>
                  <Text>{i18n.t('controls.no_favorites')}</Text>
                </Center>
              ) : (
                <ControlSectionList data={data} />
              )
            }
          />
        ))}
      </Tab.Navigator>
    </>
  );
};

export default ControlsScreen;

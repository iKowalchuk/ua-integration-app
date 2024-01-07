import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Stack } from 'expo-router';
import i18n from 'i18n-js';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { Control } from '@/api/getControls';
import LoadingView from '@/components/LoadingView';
import { useAuthContext } from '@/contexts/AuthContext';
import ControlSectionList from '@/screens/ControlsScreen/ControlSectionList';
import useControlsStore from '@/stores/useControlsStore';
import useProjectsStore from '@/stores/useProjectsStore';

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

  const sectionItems = useMemo(() => {
    const groupFavorites = i18n.t('controls.section.favorites');

    const entries = Object.entries(
      controls.reduce(
        (acc: { [key: string]: Control[] }, { groupName, ...other }) => {
          return Object.assign(acc, {
            ...(favorites.includes(other.id) && {
              [groupFavorites]: [
                ...(acc[groupFavorites] || []),
                { groupName, ...other },
              ],
            }),
            [groupName]: [...(acc[groupName] || []), { groupName, ...other }],
          });
        },
        {}
      )
    );

    // Sort the entries so that groupFavorites always comes first
    entries.sort(([keyA], [keyB]) => {
      if (keyA === groupFavorites) return -1;
      if (keyB === groupFavorites) return 1;
      return 0;
    });

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

  const Tab = createMaterialTopTabNavigator();

  return (
    <>
      <Stack.Screen options={{ headerTitle: currentProject?.name }} />

      <Tab.Navigator
        key={favorites.length === 0 ? 'no-favorites' : 'with-favorites'}
        initialLayout={{ width }}
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarItemStyle: { width: 'auto' },
        }}
      >
        {sectionItems.map(({ title, data }) => (
          <Tab.Screen
            key={title}
            name={title}
            component={memo(() => (
              <ControlSectionList data={data} />
            ))}
            options={{ tabBarLabel: title }}
          />
        ))}
      </Tab.Navigator>
    </>
  );
};

export default ControlsScreen;

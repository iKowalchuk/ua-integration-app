import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import i18n from 'i18n-js';
import React from 'react';
import { useColorScheme } from 'react-native';

import Colors from '@/constants/Colors';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
const TabBarIcon = (props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) => {
  return <Ionicons size={28} style={{ marginBottom: -6 }} {...props} />;
};

const TabLayout = () => {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: i18n.t('common.controls_screen'),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-key-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: i18n.t('common.projects_screen'),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-business-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: i18n.t('common.settings_screen'),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-settings-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;

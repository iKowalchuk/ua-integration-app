import { Box, Text, VStack } from '@gluestack-ui/themed';
import { nativeApplicationVersion } from 'expo-application';
import React from 'react';

const Settings = () => {
  return (
    <Box flex={1} padding="$4">
      <VStack flex={1} space="md" />
      <VStack space="md">
        <Text size="xs" textAlign="center">
          v{nativeApplicationVersion}
        </Text>
      </VStack>
    </Box>
  );
};

export default Settings;

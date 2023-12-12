import { Center, Heading, HStack, Spinner } from '@gluestack-ui/themed';
import i18n from 'i18n-js';
import React from 'react';

const LoadingView = () => {
  return (
    <Center flex={1} px="$3">
      <HStack space="md" alignItems="center">
        <Spinner accessibilityLabel="Loading" />
        <Heading color="$primary500" size="md">
          {i18n.t('login.loading_label')}
        </Heading>
      </HStack>
    </Center>
  );
};

export default LoadingView;

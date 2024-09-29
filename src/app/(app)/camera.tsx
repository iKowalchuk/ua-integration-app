import { Center, Text, VStack } from '@gluestack-ui/themed';
import i18n from 'i18n-js';

import Card from '@/components/Card';

const Camera = () => {
  return (
    <VStack flex={1} p={16} space="md">
      <Card>
        <Center aspectRatio="16/9">
          <Text>{i18n.t('camera.no_signal')}</Text>
        </Center>
      </Card>
    </VStack>
  );
};

export default Camera;

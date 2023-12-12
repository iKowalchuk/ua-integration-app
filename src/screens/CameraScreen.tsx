import { Center, Text, VStack } from '@gluestack-ui/themed';
import i18n from 'i18n-js';
import { SafeAreaView } from 'react-native-safe-area-context';

import Card from '@/components/Card';

const CameraScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <VStack flex={1} p={16} space="md" justifyContent="space-between">
        <Card>
          <Center aspectRatio="16/9">
            <Text>{i18n.t('camera.no_signal')}</Text>
          </Center>
        </Card>
      </VStack>
    </SafeAreaView>
  );
};

export default CameraScreen;

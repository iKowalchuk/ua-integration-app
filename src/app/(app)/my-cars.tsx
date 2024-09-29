import { Text } from '@gluestack-ui/themed';
import { Stack } from 'expo-router';
import i18n from 'i18n-js';
import { TouchableOpacity } from 'react-native';

const MyCars = () => {
  return (
    <Stack.Screen
      options={{
        headerRight: () => (
          <TouchableOpacity>
            <Text>{i18n.t('button.add')}</Text>
          </TouchableOpacity>
        ),
      }}
    />
  );
};

export default MyCars;

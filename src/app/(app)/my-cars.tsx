import { Text } from '@gluestack-ui/themed';
import { Link, Stack } from 'expo-router';
import i18n from 'i18n-js';
import { TouchableOpacity } from 'react-native';

const MyCars = () => {
  return (
    <Stack.Screen
      options={{
        headerRight: () => (
          <Link href="/my-car-add" asChild>
            <TouchableOpacity>
              <Text color="$blue500">{i18n.t('button.add')}</Text>
            </TouchableOpacity>
          </Link>
        ),
      }}
    />
  );
};

export default MyCars;

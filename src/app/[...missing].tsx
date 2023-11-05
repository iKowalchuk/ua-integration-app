import { Link, Stack } from 'expo-router';
import i18n from 'i18n-js';
import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';

const NotFoundScreen = () => {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.title}>
          {i18n.t('404.this_screen_doesnt_exist')}
        </Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>{i18n.t('404.go_to_home_screen')}</Text>
        </Link>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});

export default NotFoundScreen;

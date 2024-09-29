import {
  Divider,
  HStack,
  Icon,
  ScrollView,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { useRouter } from 'expo-router';
import i18n from 'i18n-js';
import {
  BellIcon,
  CarFrontIcon,
  CarIcon,
  ChevronRightIcon,
  NewspaperIcon,
} from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

import Card from '@/components/Card';

const TabMenu = () => {
  const router = useRouter();

  return (
    <ScrollView flex={1}>
      <VStack flex={1} p={16} space="xl">
        <Card>
          <TouchableOpacity
            onPress={() => {
              router.push('/guest-cars');
            }}
          >
            <VStack py={8} px={16}>
              <HStack
                space="2xl"
                justifyContent="space-between"
                alignItems="center"
              >
                <HStack space="md" alignItems="center">
                  <Icon as={CarFrontIcon} />
                  <Text size="lg">{i18n.t('menu.guest_cars')}</Text>
                </HStack>
                <Icon as={ChevronRightIcon} />
              </HStack>
            </VStack>
          </TouchableOpacity>
          <Divider ml={44} />
          <TouchableOpacity
            onPress={() => {
              router.push('/my-cars');
            }}
          >
            <VStack py={8} px={16}>
              <HStack
                space="2xl"
                justifyContent="space-between"
                alignItems="center"
              >
                <HStack space="md" alignItems="center">
                  <Icon as={CarIcon} />
                  <Text size="lg">{i18n.t('menu.my_cars')}</Text>
                </HStack>
                <Icon as={ChevronRightIcon} />
              </HStack>
            </VStack>
          </TouchableOpacity>
        </Card>
        <Card>
          <TouchableOpacity
            onPress={() => {
              router.push('/publications');
            }}
          >
            <VStack py={8} px={16}>
              <HStack
                space="2xl"
                justifyContent="space-between"
                alignItems="center"
              >
                <HStack space="md" alignItems="center">
                  <Icon as={NewspaperIcon} />
                  <Text size="lg">{i18n.t('menu.publications')}</Text>
                </HStack>
                <Icon as={ChevronRightIcon} />
              </HStack>
            </VStack>
          </TouchableOpacity>
          <Divider ml={44} />
          <TouchableOpacity
            onPress={() => {
              router.push('/notifications');
            }}
          >
            <VStack py={8} px={16}>
              <HStack
                space="2xl"
                justifyContent="space-between"
                alignItems="center"
              >
                <HStack space="md" alignItems="center">
                  <Icon as={BellIcon} />
                  <Text size="lg">{i18n.t('menu.notifications')}</Text>
                </HStack>
                <Icon as={ChevronRightIcon} />
              </HStack>
            </VStack>
          </TouchableOpacity>
        </Card>
      </VStack>
    </ScrollView>
  );
};

export default TabMenu;

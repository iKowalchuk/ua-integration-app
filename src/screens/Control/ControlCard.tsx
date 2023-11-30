import {
  Box,
  Button,
  ButtonIcon,
  ButtonText,
  HStack,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { useFocusEffect } from 'expo-router';
import i18n from 'i18n-js';
import { MoreHorizontal, Video } from 'lucide-react-native';
import { useState, useRef, useCallback } from 'react';
import { InView } from 'react-native-intersection-observer';

import getButtonStatus, { ButtonStatus } from '@/api/getButtonStatus';
import runCommand from '@/api/runCommand';
import Card from '@/components/Card';
import Skeleton from '@/components/Skeleton';
import { useAuthContext } from '@/contexts/AuthContext';
import useAppState from '@/hooks/useAppState';
import OpenConfirmModal from '@/screens/Control/OpenConfirmModal';

const showVideoButton = false;
const showMoreButton = false;

type ControlItemProps = {
  label: string;
  command: string;
};

const ControlCard = ({ label, command }: ControlItemProps) => {
  const { authState } = useAuthContext();

  const { appState } = useAppState();

  const [buttonStatus, setButtonStatus] = useState<ButtonStatus | null>(null);
  const [inView, setInView] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isRunCommand, setIsRunCommand] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout>();

  const handleRunCommand = async () => {
    if (authState.type !== 'authenticated') {
      return;
    }

    try {
      setIsRunCommand(true);
      await runCommand({
        apiURL: authState.session.apiURL,
        token: authState.session.token,
        command,
      });
      setButtonStatus('open');
      setShowModal(false);
    } finally {
      setIsRunCommand(false);
    }
  };

  const handleVideoPress = () => {};

  const handeMorePress = () => {};

  useFocusEffect(
    useCallback(() => {
      const getButtonStatusRequest = async () => {
        if (authState.type !== 'authenticated') {
          return;
        }

        const data = await getButtonStatus({
          apiURL: authState.session.apiURL,
          token: authState.session.token,
          command,
        });
        setButtonStatus(data);
      };

      if (appState === 'active' && inView) {
        getButtonStatusRequest();
        intervalRef.current = setInterval(getButtonStatusRequest, 3000);
      }
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, [authState, appState, inView])
  );

  if (buttonStatus === null) {
    return (
      <InView onChange={setInView}>
        <Card>
          <VStack padding="$4" space="md">
            <HStack
              space="md"
              justifyContent="space-between"
              alignItems="center"
            >
              <VStack space="xs">
                <Skeleton width={64} height={20} borderRadius={5} />
                <Skeleton width={124} height={22} borderRadius={5} />
              </VStack>
              <HStack space="3xl">
                <Skeleton width={24} height={24} borderRadius={5} />
                <Skeleton width={24} height={24} borderRadius={5} />
              </HStack>
            </HStack>
            <Skeleton width="100%" height={40} borderRadius={5} />
          </VStack>
        </Card>
      </InView>
    );
  }

  return (
    <>
      <OpenConfirmModal
        title={label}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        onConfirm={() => {
          handleRunCommand();
        }}
        isLoading={isRunCommand}
      />

      <InView onChange={setInView}>
        <Card>
          <VStack padding="$4" space="md">
            <HStack
              space="md"
              justifyContent="space-between"
              alignItems="center"
            >
              <VStack flex={1}>
                <Box h="$6">
                  <Text
                    color={
                      buttonStatus === 'online' || buttonStatus === 'open'
                        ? '$green500'
                        : '$red500'
                    }
                    size="sm"
                  >
                    {buttonStatus === 'online' || buttonStatus === 'open'
                      ? i18n.t('status.online')
                      : i18n.t('status.offline')}
                  </Text>
                </Box>
                <Text size="md" fontWeight="$bold" numberOfLines={1}>
                  {label}
                </Text>
              </VStack>
              <HStack space="3xl">
                <Button
                  size="md"
                  variant="link"
                  action="primary"
                  onPress={handleVideoPress}
                  isDisabled={!showVideoButton}
                >
                  <ButtonIcon as={Video} size="xl" />
                </Button>
                <Button
                  size="md"
                  variant="link"
                  action="primary"
                  onPress={handeMorePress}
                  isDisabled={!showMoreButton}
                >
                  <ButtonIcon as={MoreHorizontal} size="xl" />
                </Button>
              </HStack>
            </HStack>
            <Button
              action={buttonStatus === 'offline' ? 'secondary' : 'primary'}
              onPress={() => {
                setShowModal(true);
              }}
              isDisabled={buttonStatus !== 'online'}
            >
              <ButtonText>
                {buttonStatus === 'open'
                  ? i18n.t('button.opened')
                  : i18n.t('button.open')}
              </ButtonText>
            </Button>
          </VStack>
        </Card>
      </InView>
    </>
  );
};

export default ControlCard;

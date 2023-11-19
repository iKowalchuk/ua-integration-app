import {
  Box,
  Button,
  ButtonIcon,
  ButtonText,
  HStack,
  Text,
} from '@gluestack-ui/themed';
import i18n from 'i18n-js';
import { MoreHorizontal, Video } from 'lucide-react-native';
import { useEffect, useState, useRef } from 'react';

import getButtonStatus, { ButtonStatus } from '@/api/getButtonStatus';
import runCommand from '@/api/runCommand';
import Card from '@/components/Card';
import { useAuthContext } from '@/hooks/useAuth';
import OpenConfirmModal from '@/screens/Control/OpenConfirmModal';

const showVideoButton = false;
const showMoreButton = false;

type ControlItemProps = {
  label: string;
  command: string;
};

const ControlCard = ({ label, command }: ControlItemProps) => {
  const { auth } = useAuthContext();

  const [buttonStatus, setButtonStatus] = useState<ButtonStatus | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isRunCommand, setIsRunCommand] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout>();

  const handleRunCommand = async () => {
    if (auth.type !== 'authorized') {
      return;
    }

    try {
      setIsRunCommand(true);
      await runCommand({ token: auth.token, command });
      setButtonStatus('open');
      setShowModal(false);
    } finally {
      setIsRunCommand(false);
    }
  };

  const handleVideoPress = () => {};

  const handeMorePress = () => {};

  const getButtonStatusRequest = async () => {
    if (auth.type !== 'authorized') {
      return;
    }

    const data = await getButtonStatus({ command, token: auth.token });
    setButtonStatus(data);
  };

  useEffect(() => {
    getButtonStatusRequest();
    intervalRef.current = setInterval(getButtonStatusRequest, 3000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

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

      <Card>
        <Box padding="$4">
          <Box mb="$3">
            <HStack
              space="md"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
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
                <Text size="md" fontWeight="$bold">
                  {label}
                </Text>
              </Box>
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
          </Box>
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
        </Box>
      </Card>
    </>
  );
};

export default ControlCard;

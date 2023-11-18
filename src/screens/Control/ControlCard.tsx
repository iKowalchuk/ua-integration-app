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
import { useState } from 'react';

import runCommand from '@/api/runCommand';
import Card from '@/components/Card';
import { useAuthContext } from '@/hooks/useAuth';
import OpenConfirmModal from '@/screens/Control/OpenConfirmModal';

type Status = 'online' | 'offline';

type ControlItemProps = {
  label: string;
  command: string;
};

const ControlCard = ({ label, command }: ControlItemProps) => {
  const { auth } = useAuthContext();

  const status: Status = 'online';

  const [showModal, setShowModal] = useState(false);
  const [isRunCommand, setIsRunCommand] = useState(false);

  const handleRunCommand = async () => {
    if (auth.type !== 'authorized') {
      return;
    }

    try {
      setIsRunCommand(true);
      await runCommand({ token: auth.token, command });
      setShowModal(false);
    } finally {
      setIsRunCommand(false);
    }
  };

  const handleVideoPress = () => {};

  const handeMorePress = () => {};

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
                  color={status === 'online' ? '$green500' : '$red500'}
                  size="sm"
                >
                  {status === 'online'
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
                >
                  <ButtonIcon as={Video} size="xl" />
                </Button>
                <Button
                  size="md"
                  variant="link"
                  action="primary"
                  onPress={handeMorePress}
                >
                  <ButtonIcon as={MoreHorizontal} size="xl" />
                </Button>
              </HStack>
            </HStack>
          </Box>
          <Button onPress={() => setShowModal(true)}>
            <ButtonText>{i18n.t('button.open')}</ButtonText>
          </Button>
        </Box>
      </Card>
    </>
  );
};

export default ControlCard;

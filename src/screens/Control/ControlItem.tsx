import {
  Box,
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
  HStack,
  Text,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  Heading,
  ModalCloseButton,
  Icon,
  CloseIcon,
  ModalBody,
  ModalFooter,
} from '@gluestack-ui/themed';
import i18n from 'i18n-js';
import { Video, MoreHorizontal } from 'lucide-react-native';
import { useState } from 'react';

import runCommand from '@/api/runCommand';
import Card from '@/components/Card';
import { useAuthContext } from '@/hooks/useAuth';

type Status = 'online' | 'offline';

type ControlItemProps = {
  label: string;
  command: string;
};

const ControlItem = ({ label, command }: ControlItemProps) => {
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
      <Modal
        isOpen={showModal}
        closeOnOverlayClick={!isRunCommand}
        onClose={() => {
          setShowModal(false);
        }}
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg">{label}</Heading>
            <ModalCloseButton disabled={isRunCommand}>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody />
          <ModalFooter>
            <Button
              flex={1}
              variant="outline"
              size="sm"
              action="secondary"
              mr="$3"
              onPress={() => {
                setShowModal(false);
              }}
              isDisabled={isRunCommand}
            >
              <ButtonText>Скасувати</ButtonText>
            </Button>
            <Button
              flex={1}
              size="sm"
              action="positive"
              borderWidth="$0"
              onPress={() => {
                handleRunCommand();
              }}
              isDisabled={isRunCommand}
            >
              {isRunCommand && <ButtonSpinner mr="$1" />}
              <ButtonText>Відкрити</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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

export default ControlItem;

import {
  Box,
  Button,
  ButtonIcon,
  ButtonText,
  HStack,
  Icon,
  Menu,
  MenuItem,
  MenuItemLabel,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { useFocusEffect, useRouter } from 'expo-router';
import i18n from 'i18n-js';
import {
  MoreHorizontal as MoreHorizontalIcon,
  Video as VideoIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  Pencil as PencilIcon,
} from 'lucide-react-native';
import { useState, useRef, useCallback } from 'react';
import { InView } from 'react-native-intersection-observer';

import getButtonStatus, { ButtonStatus } from '@/api/getButtonStatus';
import { Control } from '@/api/getControls';
import runCommand from '@/api/runCommand';
import Card from '@/components/Card';
import Skeleton from '@/components/Skeleton';
import { useAuthContext } from '@/contexts/AuthContext';
import useAppState from '@/hooks/useAppState';
import OpenConfirmActionsheet from '@/screens/ControlsScreen/OpenConfirmActionsheet';
import RenameModal from '@/screens/ControlsScreen/RenameModal';
import useControlsStore from '@/stores/useControlsStore';

type ControlCardProps = {
  control: Control;
};

const ControlCard = ({ control }: ControlCardProps) => {
  const router = useRouter();

  const { authState } = useAuthContext();

  const { appState } = useAppState();

  const { hasFavorite, toggleFavorite, renameControl } = useControlsStore(
    (state) => ({
      hasFavorite: state.hasFavorite,
      toggleFavorite: state.toggleFavorite,
      renameControl: state.renameControl,
    })
  );

  const [buttonStatus, setButtonStatus] = useState<ButtonStatus | null>(null);
  const [inView, setInView] = useState(false);
  const [isRunCommand, setIsRunCommand] = useState(false);

  const [showOpenActionsheet, setShowOpenActionsheet] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);

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
        command: control.command,
      });
      setButtonStatus('open');
      setShowOpenActionsheet(false);
    } finally {
      setIsRunCommand(false);
    }
  };

  const handleVideoPress = () => {
    router.push('/camera');
  };

  useFocusEffect(
    useCallback(() => {
      const getButtonStatusRequest = async () => {
        if (authState.type !== 'authenticated') {
          return;
        }

        const data = await getButtonStatus({
          apiURL: authState.session.apiURL,
          token: authState.session.token,
          command: control.command,
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
      <OpenConfirmActionsheet
        title={control.name}
        isOpen={showOpenActionsheet}
        onConfirm={() => {
          handleRunCommand();
        }}
        onClose={() => {
          setShowOpenActionsheet(false);
        }}
        isLoading={isRunCommand}
      />

      <RenameModal
        name={control.name}
        isOpen={showRenameModal}
        onSave={(name) => {
          renameControl(control.id, name);
          setShowRenameModal(false);
        }}
        onClose={() => {
          setShowRenameModal(false);
        }}
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
                  {control.name}
                </Text>
              </VStack>
              <HStack space="3xl">
                <Button
                  size="md"
                  variant="link"
                  action="primary"
                  onPress={handleVideoPress}
                >
                  <ButtonIcon as={VideoIcon} size="xl" />
                </Button>
                <Menu
                  placement="bottom right"
                  trigger={({ ...triggerProps }) => {
                    return (
                      <Button
                        {...triggerProps}
                        size="md"
                        variant="link"
                        action="primary"
                      >
                        <ButtonIcon as={MoreHorizontalIcon} size="xl" />
                      </Button>
                    );
                  }}
                >
                  <MenuItem
                    key="change-name"
                    textValue={i18n.t('button.rename')}
                    onPressOut={() => {
                      setShowRenameModal(true);
                    }}
                  >
                    <Icon as={PencilIcon} size="sm" mr="$2" />
                    <MenuItemLabel size="sm">
                      {i18n.t('button.rename')}
                    </MenuItemLabel>
                  </MenuItem>
                  {hasFavorite(control) ? (
                    <MenuItem
                      key="favorite-remove"
                      textValue={i18n.t('button.favorite_remove')}
                      onPressOut={() => {
                        toggleFavorite(control);
                      }}
                    >
                      <Icon as={MinusIcon} size="sm" mr="$2" />
                      <MenuItemLabel size="sm">
                        {i18n.t('button.favorite_remove')}
                      </MenuItemLabel>
                    </MenuItem>
                  ) : (
                    <MenuItem
                      key="favorite-add"
                      textValue={i18n.t('button.favorite_add')}
                      onPressOut={() => {
                        toggleFavorite(control);
                      }}
                    >
                      <Icon as={PlusIcon} size="sm" mr="$2" />
                      <MenuItemLabel size="sm">
                        {i18n.t('button.favorite_add')}
                      </MenuItemLabel>
                    </MenuItem>
                  )}
                </Menu>
              </HStack>
            </HStack>
            <Button
              action={buttonStatus === 'offline' ? 'secondary' : 'primary'}
              onPress={() => {
                setShowOpenActionsheet(true);
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

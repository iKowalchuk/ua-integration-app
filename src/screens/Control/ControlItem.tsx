import {
  Box,
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
  HStack,
  Text,
} from '@gluestack-ui/themed';
import i18n from 'i18n-js';
import { Video, MoreHorizontal } from 'lucide-react-native';
import React from 'react';

import Card from '@/components/Card';

type ControlItemProps = {
  label: string;
  status: 'online' | 'offline';
  onOpenPress: () => void;
  onVideoPress: () => void;
  onMorePress: () => void;
  isDisabled: boolean;
  isRunCommand: boolean;
};

const ControlItem = ({
  label,
  status,
  onOpenPress,
  onVideoPress,
  onMorePress,
  isDisabled,
  isRunCommand,
}: ControlItemProps) => (
  <Card>
    <Box padding="$4">
      <Box mb="$3">
        <HStack space="md" justifyContent="space-between" alignItems="center">
          <Box>
            <Text
              color={status === 'online' ? '$green500' : '$red500'}
              fontSize="$sm"
            >
              {status === 'online'
                ? i18n.t('status.online')
                : i18n.t('status.offline')}
            </Text>
            <Text fontSize="$md" fontWeight="$bold">
              {label}
            </Text>
          </Box>
          <HStack space="3xl">
            <Button
              size="md"
              variant="link"
              action="primary"
              onPress={onVideoPress}
            >
              <ButtonIcon as={Video} size="xl" />
            </Button>
            <Button
              size="md"
              variant="link"
              action="primary"
              onPress={onMorePress}
            >
              <ButtonIcon as={MoreHorizontal} size="xl" />
            </Button>
          </HStack>
        </HStack>
      </Box>
      <Button onPress={onOpenPress} isDisabled={isDisabled}>
        {isRunCommand && <ButtonSpinner mr="$1" />}
        <ButtonText>{i18n.t('button.open')}</ButtonText>
      </Button>
    </Box>
  </Card>
);

export default ControlItem;

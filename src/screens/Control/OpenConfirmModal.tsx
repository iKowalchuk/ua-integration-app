import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  Button,
  ButtonSpinner,
  ButtonText,
  Center,
  Heading,
  HStack,
  Spinner,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import i18n from 'i18n-js';

type OpenConfirmModalProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
};

const OpenConfirmModal = ({
  title,
  isOpen,
  onConfirm,
  onClose,
  isLoading,
}: OpenConfirmModalProps) => (
  <Actionsheet
    isOpen={isOpen}
    onClose={onClose}
    closeOnOverlayClick={!isLoading}
  >
    <ActionsheetBackdrop />
    <ActionsheetContent h={180}>
      {isLoading ? (
        <Center w="$full" h="$full">
          <Spinner size="large" />
        </Center>
      ) : (
        <>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <VStack w="$full" h="$full" px={20} pt={8} p={30}>
            <VStack flex={1}>
              <Heading size="lg" numberOfLines={1}>
                {title}
              </Heading>
              <Text size="md">{i18n.t('control.confirm.subtitle')}</Text>
            </VStack>
            <HStack alignItems="center" space="md">
              <Button
                flex={1}
                variant="outline"
                size="sm"
                action="secondary"
                mr="$3"
                onPress={onClose}
                isDisabled={isLoading}
              >
                <ButtonText>{i18n.t('button.cancel')}</ButtonText>
              </Button>
              <Button
                flex={1}
                size="sm"
                action="positive"
                borderWidth="$0"
                onPress={onConfirm}
                isDisabled={isLoading}
              >
                {isLoading && <ButtonSpinner mr="$1" />}
                <ButtonText>{i18n.t('button.open')}</ButtonText>
              </Button>
            </HStack>
          </VStack>
        </>
      )}
    </ActionsheetContent>
  </Actionsheet>
);

export default OpenConfirmModal;

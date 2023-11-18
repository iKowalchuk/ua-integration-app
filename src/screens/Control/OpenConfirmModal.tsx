import {
  Button,
  ButtonSpinner,
  ButtonText,
  Center,
  CloseIcon,
  Heading,
  Icon,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
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
  <Modal isOpen={isOpen} closeOnOverlayClick={!isLoading} onClose={onClose}>
    <ModalBackdrop />
    <ModalContent h={140}>
      {isLoading ? (
        <Center flex={1}>
          <Spinner size="large" />
        </Center>
      ) : (
        <>
          <ModalHeader>
            <Heading size="lg">{title}</Heading>
            <ModalCloseButton disabled={isLoading}>
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
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
);

export default OpenConfirmModal;

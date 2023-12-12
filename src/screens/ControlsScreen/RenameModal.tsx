import {
  Button,
  ButtonText,
  CloseIcon,
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
  Heading,
  Icon,
  Input,
  InputField,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from '@gluestack-ui/themed';
import i18n from 'i18n-js';
import React, { useState } from 'react';

type RenameModalProps = {
  name: string;
  isOpen: boolean;
  onSave: (name: string) => void;
  onClose: () => void;
};

const MAX_LENGTH = 25;

const RenameModal = ({ name, isOpen, onSave, onClose }: RenameModalProps) => {
  const [formData, setFormData] = useState<{ name: string }>({
    name: name || '',
  });

  const [isSubmit, setIsSubmit] = useState(false);

  const handleClose = () => {
    setIsSubmit(false);
    setFormData({ ...formData, name });
    onClose();
  };

  const handleSave = () => {
    setIsSubmit(true);

    if (!formData.name.trim()) {
      return;
    }

    onSave(formData.name);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading flex={1} size="lg" numberOfLines={1}>
            {i18n.t('controls.rename_modal.title')}
          </Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <FormControl size="md" isInvalid={isSubmit && !formData.name.trim()}>
            <FormControlLabel
              justifyContent="space-between"
              alignItems="flex-end"
              mb="$1"
            >
              <FormControlLabelText>
                {i18n.t('controls.rename_modal.name_label')}
              </FormControlLabelText>
              <Text size="xs">
                {formData.name.length}/{MAX_LENGTH}
              </Text>
            </FormControlLabel>
            <Input>
              <InputField
                value={formData.name}
                onChangeText={(value) =>
                  setFormData({ ...formData, name: value })
                }
                maxLength={MAX_LENGTH}
              />
            </Input>
            <FormControlError>
              <FormControlErrorText>
                {i18n.t('controls.rename_modal.name_is_required_error')}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button flex={1} action="positive" onPress={handleSave}>
            <ButtonText>{i18n.t('button.save')}</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RenameModal;

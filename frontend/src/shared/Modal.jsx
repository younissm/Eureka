import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

const CustomeModal = ({
  isModalOpen,
  onModalClose,
  title,
  children,
  okTxt = "Done",
  cancelTxt = "Cancel",
  onSubmit,
  loading,
  errorsExist,
}) => {
  return (
    <Modal
      isCentered
      onClose={onModalClose}
      isOpen={isModalOpen}
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent as="form" onSubmit={onSubmit}>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        <ModalFooter gap="8px">
          <Button onClick={onModalClose}>{cancelTxt}</Button>
          <Button
            type="submit"
            backgroundColor="purple.600"
            color="white"
            p="5"
            _hover={{ backgroundColor: "purple.800" }}
            isLoading={loading}
            isDisabled={errorsExist}
          >
            {okTxt}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CustomeModal;

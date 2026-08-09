import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Popup = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="purple.600">
        <ModalHeader fontWeight="bold" color="white">
          مرحبا بك
        </ModalHeader>
        <ModalBody>
          <Text fontSize="x-large" color="white">
            سجل الدخول أو اشترك للاستمتاع بمزايا الموقع
          </Text>
        </ModalBody>
        <ModalFooter gap="5px">
          <Button
            as={Link}
            to="/login"
            bg="white"
            color="purple.600"
            _focus={{
              boxShadow: "none",
            }}
            onClick={onClose}
          >
            تسجيل الدخول
          </Button>
          <Button
            as={Link}
            to="/signup"
            variant="outline"
            color="white"
            _focus={{
              boxShadow: "none",
            }}
            onClick={onClose}
          >
            اشتراك
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Popup;

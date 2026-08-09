import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";

export default function CustomeAlertDialog({
  onClose,
  isOpen,
  mutate,
  loading,
}) {
  const cancelRef = useRef();

  const handleDelete = () => {
    mutate();
    onClose();
  };

  return (
    <>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              حذف
            </AlertDialogHeader>

            <AlertDialogBody>
              هل انت متأكد؟ لا يمكنك التراجع بعد ذلك
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                الغاء
              </Button>
              <Button
                colorScheme="red"
                ml={3}
                isLoading={loading}
                onClick={handleDelete}
              >
                حذف
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

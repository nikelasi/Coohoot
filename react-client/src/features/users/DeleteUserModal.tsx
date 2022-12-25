import { Button, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, Text } from "@chakra-ui/react"
import Modal from "../layout/Modal.layout"

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteUserModal: React.FC<ModalProps> = ({ isOpen, onClose }: ModalProps) => {

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}>
      <ModalHeader>Delete Account</ModalHeader>
      <ModalCloseButton />
      <ModalBody
        display="flex"
        flexDirection="column"
        gap="4">
        <Text>Are you sure you want to delete your account?</Text>
      </ModalBody>
      <ModalFooter
        display="flex"
        gap="2">
        <Button
          colorScheme="red"
          onClick={onClose}>
          Delete
        </Button>
        <Button
          onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default DeleteUserModal
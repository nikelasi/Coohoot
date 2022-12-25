import { Button, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, Text } from "@chakra-ui/react"
import Modal from "../layout/Modal.layout"

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WIPModal: React.FC<ModalProps> = ({ isOpen, onClose }: ModalProps) => {

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}>
      <ModalHeader>Work in Progress</ModalHeader>
      <ModalCloseButton />
      <ModalBody
        display="flex"
        flexDirection="column"
        gap="4">
        <Text>The feature you are trying to access is currently under development.</Text>
      </ModalBody>
      <ModalFooter>
        <Button
          onClick={onClose}
          colorScheme="red">
          Close
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default WIPModal
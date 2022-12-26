import { Button, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, Text } from "@chakra-ui/react"
import Modal, { ModalProps } from "../layout/Modal.layout"

const WIPModal: React.FC<ModalProps> = (props: ModalProps) => {

  const { onClose } = props

  return (
    <Modal {...props}>
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
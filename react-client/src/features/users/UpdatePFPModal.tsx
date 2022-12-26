
import { ModalBody, ModalCloseButton, ModalFooter, ModalHeader, Text } from "@chakra-ui/react"
import Modal, { ModalProps } from "../layout/Modal.layout"

const UpdatePFPModal: React.FC<ModalProps> = (props: ModalProps) => {

  return (
    <Modal {...props}>
      <ModalHeader>Change Profile Photo</ModalHeader>
      <ModalCloseButton />
      <ModalBody
        display="flex"
        flexDirection="column"
        gap="4">

        <Text
          fontSize="sm">
          Update your profile photo here.
        </Text>

        {/* File Drop Zone */}
        <Text>File Drop Zone</Text>
        
      </ModalBody>
    </Modal>
  )
}

export default UpdatePFPModal
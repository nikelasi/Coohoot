
import { Button, Flex, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, Text, VStack, Image } from "@chakra-ui/react"
import { useState } from "react"
import ImageDropzone, { DropzoneState } from "../layout/ImageDropzone.component"
import Modal, { ModalProps } from "../layout/Modal.layout"

const UpdatePFPModal: React.FC<ModalProps> = (props: ModalProps) => {

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const onDropzoneChange = (dropzoneState: DropzoneState) => {
    const { acceptedFiles } = dropzoneState
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0])
    } else {
      setSelectedFile(null)
    }
  }

  return (
    <Modal {...props}>
      <ModalHeader>Change Profile Photo</ModalHeader>
      <ModalCloseButton />
      <ModalBody
        display="flex"
        flexDirection="column"
        gap="4">

        { selectedFile
        ? <Flex
          gap="1"
          justifyContent="space-between"
          alignItems="flex-start"
          flexDirection={{
            base: 'column',
            md: 'row'
          }}>
          <Text
            fontSize="sm">
            Preview and crop your new profile photo.
          </Text>
          <Button
            onClick={() => setSelectedFile(null)}
            size="xs">
            Clear upload
          </Button>
        </Flex>
        : <Text
          fontSize="sm">
          Upload a new profile photo for your account.
        </Text> }

        {/* File Drop Zone */}
        { selectedFile === null && <ImageDropzone dropzoneProps={{
          onDropzoneChange
        }} /> }

        {/* Preview */}
        { selectedFile &&
        <VStack
          gap="2"
          alignItems="stretch">
          <Image src={URL.createObjectURL(selectedFile)} />
          <Button size="sm">
            Set as profile photo
          </Button>
        </VStack> }


        
      </ModalBody>
      <ModalFooter />
    </Modal>
  )
}

export default UpdatePFPModal
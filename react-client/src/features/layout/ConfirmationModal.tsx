import { Button, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import Modal, { ModalProps } from './Modal.layout'

interface ConfirmationModalProps {
  title: string
  question: string
  callback: Function
}

type Props = ConfirmationModalProps & ModalProps

const ConfirmationModal: React.FC<Props> = ({
  title,
  question,
  callback,
  ...modalProps
}: Props) => {

  const [confirming, setConfirming] = useState<boolean>(false);

  return (
    <Modal {...modalProps} onCloseComplete={() => {
      modalProps.onCloseComplete?.();
      setConfirming(false);
    }}>
      <ModalHeader>{title}</ModalHeader>
      <ModalCloseButton />
      <ModalBody
        display="flex"
        flexDirection="column"
        gap="4">
        <Text>{question}</Text>
      </ModalBody>
      <ModalFooter
        display="flex"
        gap="2">
        <Button
          onClick={async () => {
            setConfirming(true)
            await callback()
            modalProps.onClose()
          }}
          isLoading={confirming}
          loadingText="Confirming..."
          colorScheme="red">
          Confirm
        </Button>
        <Button
          onClick={modalProps.onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default ConfirmationModal
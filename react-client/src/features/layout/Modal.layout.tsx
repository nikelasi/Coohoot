import { Modal as ChakraModal, ModalContent, ModalOverlay } from '@chakra-ui/react'
import React from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCloseComplete?: () => void;
}

const Modal: React.FC<React.PropsWithChildren<ModalProps>> = ({
  isOpen,
  onClose,
  onCloseComplete,
  children
}: React.PropsWithChildren<ModalProps>) => {

  return (
    <ChakraModal
      onClose={onClose}
      onCloseComplete={onCloseComplete}
      isOpen={isOpen}
      size={{
        base: "xs",
        md: "md"
      }}>
      <ModalOverlay />
      <ModalContent>
        { children }
      </ModalContent>
    </ChakraModal>
  )
}

export default Modal
import { Modal as ChakraModal, ModalContent, ModalOverlay } from '@chakra-ui/react'
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<React.PropsWithChildren<ModalProps>> = ({
  isOpen,
  onClose,
  children
}: React.PropsWithChildren<ModalProps>) => {

  return (
    <ChakraModal onClose={onClose} size={{
      base: "xs",
      md: "md"
    }} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        { children }
      </ModalContent>
    </ChakraModal>
  )
}

export default Modal
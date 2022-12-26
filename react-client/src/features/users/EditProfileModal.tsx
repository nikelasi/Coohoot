import { Button, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, Text, HStack, Image, VStack, useDisclosure, Avatar } from "@chakra-ui/react"
import { MdPassword } from "react-icons/md";
import { useAuth } from "../auth/AuthContext";
import Modal, { ModalProps } from "../layout/Modal.layout"
import WIPModal from "../layout/WIPModal";
import UpdatePasswordModal from "./ChangePasswordModal";

const EditProfileModal: React.FC<ModalProps> = (props: ModalProps) => {

  const { onClose } = props

  const { user } = useAuth()
  const { username, email, pfp_url } = user || {}

  const { isOpen: isWIPOpen, onClose: onWIPClose, onOpen: onWIPOpen } = useDisclosure()
  const { isOpen: isCPOpen, onClose: onCPClose, onOpen: onCPOpen } = useDisclosure()

  return (
    <Modal {...props}>

      <WIPModal isOpen={isWIPOpen} onClose={onWIPClose} />
      <UpdatePasswordModal isOpen={isCPOpen} onClose={onCPClose} />

      <ModalHeader>Edit Profile</ModalHeader>
      <ModalCloseButton />
      <ModalBody
        display="flex"
        flexDirection="column"
        gap="4">

        <Text
          fontSize="sm">
          Update your profile information here.
        </Text>

        {/* Profile Card */}
        <HStack
          bgColor="highlight"
          p="4"
          borderRadius="lg"
          gap="2"
          alignItems="center">
          <Avatar
            _hover={{
              "&::after": {
                color: "white",
                textTransform: "lowercase",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "xs",
                content: "'change'",
                position: "absolute",
                inset: "0 0 0 0",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "100%"
              }
            }}
            cursor="pointer"
            onClick={onWIPOpen}
            borderRadius="100%"
            border="3px solid"
            boxSize="16"
            color="brand"
            src={pfp_url} />
          <VStack
            alignItems="flex-start"
            overflow="auto">
            <Text
              lineHeight="8"
              color="brand.accent"
              fontSize="3xl"
              noOfLines={1}
              maxWidth={{
                base: "100%",
                md: "25vw"
              }}>
              {username}
            </Text>
            <Text
              marginTop="0px"
              marginBlockStart="0"
              color="brand"
              fontSize="md"
              noOfLines={1}
              maxWidth={{
                base: "100%",
                md: "25vw"
              }}>
              {email}
            </Text>
          </VStack>
        </HStack>
        
      </ModalBody>
      <ModalFooter
        display="flex"
        gap="6">
        <Button
          onClick={onCPOpen}
          flexGrow={1}
          leftIcon={<MdPassword />}>
          Change Password
        </Button>
        <Button
          onClick={onClose}
          colorScheme="red">
          Close
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default EditProfileModal
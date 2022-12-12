import { Flex, Heading, Text, VStack } from "@chakra-ui/react"

import CoohootOwl from '../assets/svg/CoohootOwl.svg'

const NotImplemented: React.FC = () => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      h="calc(100vh - 4rem)"
      w="100vw"
    >
      <VStack>
        <CoohootOwl boxSize="32" />
        <Heading fontSize="6xl" textAlign="center">coming soon...</Heading>
        <Text fontSize="3xl" color="brand">Page Not Implemented</Text>
      </VStack>
    </Flex>
  )
}

export default NotImplemented
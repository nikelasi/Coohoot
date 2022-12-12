import { Flex, Heading, Text, VStack } from "@chakra-ui/react"

import CoohootOwl from '../assets/svg/CoohootOwl.svg'

const NotFound: React.FC = () => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      h="calc(100vh - 4rem)"
      w="100vw"
    >
      <VStack>
        <CoohootOwl boxSize="32" />
        <Heading fontSize="6xl">coo... 404</Heading>
        <Text fontSize="3xl" color="brand">Page Not Found</Text>
      </VStack>
    </Flex>
  )
}

export default NotFound
import { Flex, Heading, Link, Text, VStack } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom";

import CoohootOwl from '../../assets/svg/CoohootOwl.svg'

interface NotFoundProps {
  message?: string;
}

const NotFound: React.FC<NotFoundProps> = ({ message = 'Page Not Found' }: NotFoundProps) => {
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
        <Text fontSize="3xl" color="brand">{message}</Text>
        <Text fontSize="l">
          Return to <Link as={RouterLink} to="/" color="brand.accent">home</Link>?
        </Text>
      </VStack>
    </Flex>
  )
}

export default NotFound
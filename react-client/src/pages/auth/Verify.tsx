import { Flex, Heading, Link, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'

import CoohootOwl from '../../assets/svg/CoohootOwl.svg'

const Verify: React.FC = () => {

  const { token } = useParams()

  const [verified, setVerified] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('verifying...')

  return (
    <Flex
      h="calc(100vh - 4rem)"
      w="100vw"
      justifyContent="center"
      alignItems="center">

      <Flex
        gap="4"
        direction={{
          base: 'column',
          md: 'row'
        }}
        alignItems="center">
        <CoohootOwl boxSize="32" />
        <Flex
          direction="column"
          alignItems={{
            base: 'center',
            md: 'flex-start'
          }}>
          <Heading>Email Verification</Heading>
          <Text fontSize="l" color="brand">{ message }</Text>
          { verified && 
          <Text fontSize="l">
            You may now&nbsp;
            <Link as={RouterLink} to="/login" color="brand">
              login
            </Link>
            !
          </Text> }
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Verify
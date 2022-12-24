import { Fade, Flex, Heading, Link, Spinner, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import api from '../../api'

import CoohootOwl from '../../assets/svg/CoohootOwl.svg'

const Verify: React.FC = () => {

  const { token } = useParams()

  const [verified, setVerified] = useState<boolean | null>(null)
  const [message, setMessage] = useState<string>('verifying...')

  const verifyEmail = async (token: string) => {
    const emailVerified = await api.auth.verifyEmail(token)
    setVerified(emailVerified)
    if (emailVerified) {
      setMessage('Your account has been verified!')
    } else {
      setMessage('Invalid or expired verification token.')
    }
  }

  useEffect(() => {
    if (!token) {
      setMessage('verification token is missing')
      setVerified(false)
    } else {
      verifyEmail(token)
    }
  }, [])

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
          }}
          textAlign={{
            base: 'center',
            md: 'left'
          }}>
          <Heading>Email Verification</Heading>
          <Fade
            in={true}
            key={JSON.stringify(verified)}>
            <Text fontSize="l" color="brand.accent">
              { verified === null && <>
                <Spinner size="xs" />&nbsp;
              </> }
              { message }
            </Text>
            { verified !== null && (verified === true
            ? <Text fontSize="l">
              You may now <Link as={RouterLink} to="/login" color="brand.accent">login</Link>!
            </Text>
            : <Text fontSize="l">
              Return to <Link as={RouterLink} to="/" color="brand.accent">home</Link>?
            </Text>) }
          </Fade>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Verify
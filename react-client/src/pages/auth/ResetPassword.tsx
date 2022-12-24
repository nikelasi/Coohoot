import { Fade, Flex, Heading, Link, Spinner, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import api from '../../api'

import CoohootOwl from '../../assets/svg/CoohootOwl.svg'
import Page from '../../features/layout/Page.layout'

const ResetPassword: React.FC = () => {

  const { token } = useParams()

  const [checking, setChecking] = useState<boolean>(true)
  const [username, setUsername] = useState<string | null>(null)
  const [message, setMessage] = useState<string>('checking...')

  const checkToken = async (token: string) => {
    const { success, username } = await api.auth.checkPasswordResetToken(token)
    if (success) {
      setUsername(username)
    } else {
      setMessage('Invalid or expired password reset link.')
    }
    setChecking(false)
  }

  useEffect(() => {
    if (!token) {
      setMessage('Password reset token is missing.')
    } else {
      checkToken(token)
    }
  }, [])

  if (checking || (!checking && username === null)) {
    return (
      <Page
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
            <Heading>Password Reset</Heading>
            <Fade
              in={true}
              key={JSON.stringify(message)}>
              <Text fontSize="l" color="brand.accent">
                { checking && <>
                  <Spinner size="xs" />&nbsp;
                </> }
                { message }
              </Text>
              { !checking && username === null &&
              <Text fontSize="l">
                Return to <Link as={RouterLink} to="/" color="brand.accent">home</Link>?
              </Text> }
            </Fade>
          </Flex>
        </Flex>
      </Page>
    )
  }

  return (
    <Page
      alignItems="center"
      py="16">
      Password Reset for { username } [WIP]
    </Page>
  )
}

export default ResetPassword
import { Heading, HStack, Spinner, Image, Text, VStack, Flex } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../api'
import Page from "../../features/layout/Page.layout"

import CoohootOwl from '../../assets/svg/CoohootOwl.svg'
import NotFound from '../common/NotFound'

const rFlexGrow = {
  base: 0,
  md: 1
}

const Profile: React.FC = () => {

  const { username } = useParams()

  const [loading, setLoading] = useState<boolean>(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    (async () => {
      const userObj = await api.users.getByUsername(username || '')
      setUser(userObj)
      setLoading(false)
    })()
  }, [])

  if (loading) {
    return (
      <Page
        justifyContent="center"
        alignItems="center">
        <VStack>
          <CoohootOwl boxSize="32" />
          <Heading fontSize="2xl">loading...</Heading>
          <Spinner size="xl" />
        </VStack>
      </Page>
    )
  }

  if (!loading && user === null) {
    return <NotFound message="User Not Found" />
  }

  const { pfp_url } = user

  return (
    <Page
      p="8"
      gap="4">

      {/* Profile */}
      <HStack
        gap="2"
        alignItems="center">
        <Image
          borderRadius="100%"
          border="3px solid"
          borderColor="brand"
          boxSize="16"
          src={pfp_url}
          alt={`${username}'s profile photo`} />
        <Text
          color="brand.accent"
          fontSize="3xl"
          noOfLines={1}>
          {username}
        </Text>
      </HStack>
      {/* User's Creations */}
      <Flex
        flexGrow="1"
        gap={{
          base: "4",
          md: "8"
        }}
        direction={{
          base: "column",
          md: "row"
        }}>
        {/* User's Quizzes */}
        <VStack
          flexGrow={rFlexGrow}
          alignItems="stretch">
          <Heading>Quizzes</Heading>
          <VStack
            p="4"
            borderRadius="0.4rem"
            bgColor="highlight"
            alignItems="flex-start"
            flexGrow={rFlexGrow}>
            <Text>{username} has no quizzes</Text>
          </VStack>
        </VStack>
        {/* User's Sessions */}
        <VStack
          flexGrow={rFlexGrow}
          alignItems="stretch">
          <Heading>Sessions</Heading>
          <VStack
            p="4"
            borderRadius="0.4rem"
            bgColor="highlight"
            alignItems="flex-start"
            flexGrow={rFlexGrow}>
            <Text>{username} has not started any quiz sessions</Text>
          </VStack>
        </VStack>
      </Flex>
    </Page>
  )
}

export default Profile
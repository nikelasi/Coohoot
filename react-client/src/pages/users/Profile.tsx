import { Heading, HStack, Spinner, Image, Text, VStack, Box, Flex, background } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../api'
import Page from "../../features/layout/Page.layout"

import CoohootOwl from '../../assets/svg/CoohootOwl.svg'
import NotFound from '../common/NotFound'

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
          fontSize="3xl">
          {username}
        </Text>
      </HStack>
      {/* User's Creations */}
      <Flex
        gap="4"
        direction={{
          base: "column",
          md: "row"
        }}>
        {/* User's Quizzes */}
        <VStack
          flexGrow={1}
          alignItems="stretch">
          <Heading><Text as="span" color="brand.accent">{username}</Text>'s Quizzes</Heading>
          <VStack
            p="4"
            borderRadius="0.4rem"
            bgColor="highlight"
            alignItems="flex-start">
            <Text>{username} has no quizzes</Text>
          </VStack>
        </VStack>
        {/* User's Templates */}
        <VStack
          flexGrow={1}
          alignItems="stretch">
          <Heading><Text as="span" color="brand.accent">{username}</Text>'s Templates</Heading>
          <VStack
            p="4"
            borderRadius="0.4rem"
            bgColor="highlight"
            alignItems="flex-start">
            <Text>{username} has no templates</Text>
          </VStack>
        </VStack>
      </Flex>
    </Page>
  )
}

export default Profile
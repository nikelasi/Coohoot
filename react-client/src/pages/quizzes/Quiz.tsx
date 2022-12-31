import { Heading, HStack, Spinner, Image, Text, VStack, Flex, Card, AspectRatio, Button, Link, Icon } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import api from '../../api'
import Page from "../../features/layout/Page.layout"

import CoohootOwl from '../../assets/svg/CoohootOwl.svg'
import NotFound from '../common/NotFound'
import SkeletonAvatar from '../../features/images/SkeletonAvatar'
import SkeletonImage from '../../features/images/SkeletonImage'
import { IoMdEyeOff, IoMdGlobe, IoMdLock } from 'react-icons/io'

const Quiz: React.FC = () => {

  const { quizId } = useParams()

  const [quiz, setQuiz] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    (async () => {
      const quiz = await api.quizzes.getOne(quizId || "")
      setQuiz(quiz)
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

  if (!loading && quiz === null) {
    return <NotFound message="Quiz Not Found" />
  }

  const { title, description, thumbnail_url, visibility, owner } = quiz
  const { username, pfp_url } = owner

  return (
    <Page
      w="full"
      flexDirection={{ base: "column", md: "row" }}
      overflow={{ md: "hidden" }}
      h={{ md: "calc(100vh - 4rem)" }}>
      <VStack
        p="8"
        alignItems="stretch"
        boxShadow="lg"
        sx={{ boxShadow: "2px 2px 8px 0px rgba(0, 0, 0, 0.5)" }}
        w={{
          base: "full",
          md: "40%"
        }}>
        <AspectRatio rounded="lg" boxShadow="md" ratio={16 / 9}>
          <SkeletonImage
            imageProps={{ rounded: "lg" }}
            src={thumbnail_url} />
        </AspectRatio>
        <Heading fontSize="3xl">{title}</Heading>
        {/* Visibility Icon + Text Indicator */}
        <HStack>
          <Icon as={
            visibility === "private" ? IoMdLock :
            visibility === "public" ? IoMdGlobe :
            IoMdEyeOff}
            fill="brand"
            boxSize="6" />
          <Text fontSize="md">
            { visibility === "private" ? "Private" :
              visibility === "public" ? "Public" :
              "Unlisted" }
          </Text>
        </HStack>
        <Flex
          flexDirection="column">
          <Text fontSize="sm">made by</Text>
          <Link as={RouterLink} to={`/user/${username}`} color="brand">
            <HStack>
              <SkeletonAvatar border="2px solid" color="brand" src={pfp_url} size="6" />
              <Text>{username}</Text>
            </HStack>
          </Link>
        </Flex>
        <Text fontSize="lg">{description || "No description provided"}</Text>
        <Button>Create Session</Button>
      </VStack>

      <Flex
        p="8"
        flexDir="column"
        overflow="auto"
        flexGrow="1">
        <Heading>Questions</Heading>
        <Text>This quiz has no questions</Text>
      </Flex>
    </Page>
  )
}

export default Quiz
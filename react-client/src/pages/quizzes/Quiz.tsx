import { Heading, HStack, Spinner, Image, Text, VStack, Flex, Card, AspectRatio, Button, Link, Icon, useDisclosure } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom'
import api from '../../api'
import Page from "../../features/layout/Page.layout"

import CoohootOwl from '../../assets/svg/CoohootOwl.svg'
import NotFound from '../common/NotFound'
import SkeletonAvatar from '../../features/images/SkeletonAvatar'
import SkeletonImage from '../../features/images/SkeletonImage'
import { IoMdEyeOff, IoMdGlobe, IoMdLock, IoMdTrash } from 'react-icons/io'
import { useAuth } from '../../features/auth/AuthContext'
import ConfirmationModal from '../../features/layout/ConfirmationModal'
import useToast from '../../features/layout/useToast'

const Quiz: React.FC = () => {

  const { quizId } = useParams()
  const { user } = useAuth();

  const toast = useToast()
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    (async () => {
      const quiz = await api.quizzes.getOne(quizId || "")
      setQuiz(quiz)
      setLoading(false)
    })()
  }, [])

  const { onClose: onDQClose, onOpen: onDQOpen, isOpen: isDQOpen } = useDisclosure();

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

  const { title, description, thumbnail_url, visibility, published, owner, id } = quiz
  const { username, pfp_url } = owner
  const isOwner = user.username === username

  const onDelete = async () => {
    const deleted = await api.quizzes.deleteQuiz(id);
    if (!deleted) {
      toast.error("Error", "Failed to delete quiz")
      return
    }
    toast.success("Success", "Quiz deleted")
    navigate("/dashboard")
  }

  return (
    <Page
      w="full"
      flexDirection={{ base: "column", md: "row" }}
      overflow={{ md: "hidden" }}
      minH={{ md: "calc(100vh - 4rem)" }}>

      <ConfirmationModal onClose={onDQClose} isOpen={isDQOpen}
        question="Are you sure you want to delete this quiz? All responses will be deleted."
        title="Delete Quiz"
        callback={onDelete} />

      <VStack
        p="8"
        alignItems="stretch"
        sx={{ boxShadow: "2px 0px 2px 0px rgba(0, 0, 0, 0.1)" }}
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
        <Button>Play</Button>
        { isOwner && <Button>Edit</Button> }
        { isOwner && <Button>{ published ? "Unpublish" : "Publish" }</Button> }
        { isOwner &&
        <Button
          onClick={onDQOpen}
          colorScheme="red"
          leftIcon={<IoMdTrash />}>
          Delete
        </Button> }
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
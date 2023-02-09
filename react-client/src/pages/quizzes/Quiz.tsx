import { Heading, HStack, Spinner, Image, Text, VStack, Flex, Card, AspectRatio, Button, Link, Icon, useDisclosure, Tooltip, Badge, SimpleGrid, Accordion, AccordionPanel, AccordionButton, AccordionItem, AccordionIcon } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom'
import api from '../../api'
import Page from "../../features/layout/Page.layout"

import CoohootOwl from '../../assets/svg/CoohootOwl.svg'
import NotFound from '../common/NotFound'
import SkeletonAvatar from '../../features/images/SkeletonAvatar'
import SkeletonImage from '../../features/images/SkeletonImage'
import { IoMdEyeOff, IoMdGlobe, IoMdLock } from 'react-icons/io'
import { useAuth } from '../../features/auth/AuthContext'
import ConfirmationModal from '../../features/layout/ConfirmationModal'
import useToast from '../../features/layout/useToast'
import { MdOutlinePublish } from 'react-icons/md'
import EditQuizModal from '../../features/quizzes/EditQuizModal'

enum ViewMode {
  QUESTIONS = "questions",
  RESPONSES = "responses"
}

const Quiz: React.FC = () => {

  const { quizId } = useParams()
  const { user } = useAuth();

  const toast = useToast()
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [publishing, setPublishing] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.QUESTIONS)

  const loadQuiz = async () => {
    setLoading(true)
    const quiz = await api.quizzes.getOne(quizId || "")
    setQuiz(quiz)
    setLoading(false)
  }

  useEffect(() => {
    loadQuiz()
  }, [])

  const { onClose: onDQClose, onOpen: onDQOpen, isOpen: isDQOpen } = useDisclosure();
  const { onClose: onUQClose, onOpen: onUQOpen, isOpen: isUQOpen } = useDisclosure();
  const { onClose: onEQClose, onOpen: onEQOpen, isOpen: isEQOpen } = useDisclosure();
  const { onClose: onEQDClose, onOpen: onEQDOpen, isOpen: isEQDOpen } = useDisclosure();

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

  const { title, description, thumbnail_url, visibility, published, owner, id, questions } = quiz
  const { username, pfp_url } = owner
  const isOwner = user ? user.username === username : false

  const onDelete = async () => {
    const deleted = await api.quizzes.deleteQuiz(id);
    if (!deleted) {
      toast.error("Error", "Failed to delete quiz")
      return
    }
    toast.success("Success", "Quiz deleted")
    navigate("/dashboard")
  }

  const onPublish = async () => {
    if (questions.length < 1) {
      toast.error("Cannot publish", "Quiz needs at least 1 question to be published")
      return
    }
    setPublishing(true)
    const published = await api.quizzes.publish(id)
    setPublishing(false)
    if (!published) {
      toast.error("Error", "Failed to publish quiz")
      return
    }
    toast.success("Success", "Quiz published")
    loadQuiz()
  }

  const onUnpublish = async () => {
    const unpublished = await api.quizzes.unpublish(id)
    if (!unpublished) {
      toast.error("Error", "Failed to unpublish quiz")
      return
    }
    toast.success("Success", "Quiz unpublished")
    loadQuiz()
  }

  const onUpdateDetails = (values: any) => {
    setQuiz({ ...quiz, ...values })
  }

  const onEdit = () => {
    navigate(`/quiz/${id}/edit`)
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
      <ConfirmationModal onClose={onUQClose} isOpen={isUQOpen}
        question="Are you sure you want to unpublish this quiz? All responses will be deleted."
        title="Unpublish Quiz"
        callback={onUnpublish} />
      <ConfirmationModal onClose={onEQClose} isOpen={isEQOpen}
        question="Are you sure you want to edit this published quiz? The quiz will be unpublished and all responses will be deleted."
        title="Edit Quiz"
        callback={async () => {
          await onUnpublish()
          onEdit()
        }} />
      <EditQuizModal onClose={onEQDClose} isOpen={isEQDOpen} updateDetails={onUpdateDetails} quiz={quiz} />

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
        <Button onClick={() => navigate(`/play/${id}`)}>{published ? "Play" : "Playtest"}</Button>
        { isOwner &&
        <Button
          onClick={onEQDOpen}>
          Edit Details
        </Button> }
        { isOwner &&
        <Button
          isLoading={publishing}
          loadingText="Publishing..."
          onClick={published ? onUQOpen : onPublish}>
          {published ? "Unpublish" : "Publish"}
        </Button> }
        { isOwner &&
        <Button
          onClick={onDQOpen}
          colorScheme="red">
          Delete
        </Button> }
      </VStack>

      { viewMode === ViewMode.QUESTIONS && <Flex
        p="8"
        flexDir="column"
        overflow="auto"
        flexGrow="1">
        { published && isOwner &&
        <Button
          mb="4"
          onClick={() => setViewMode(ViewMode.RESPONSES)}>
          View Responses
        </Button> }
        <HStack gap="2">
          <Heading>Questions</Heading>
          { isOwner && <Button
            onClick={published ? onEQOpen : onEdit}
            rounded="lg">
            Edit
          </Button> }
        </HStack>
        <Flex
          mt="4"
          flexDir="column"
          gap="4">
          { questions && questions.length === 0
          ? <Text>This quiz has no questions</Text>
          : questions.map((question: any, index: number) => {
            return (
              <Flex
                key={index}
                p="4"
                flexDir="column"
                gap="2"
                rounded="md"
                bgColor="highlight">
                <HStack justifyContent="space-between" w="full">
                  <Text><b>{index + 1}.</b> {question.question}</Text>
                  {question.image_url &&
                  <Flex
                    alignSelf="center"
                    mt="2"
                    rounded="md"
                    boxShadow="md"
                    overflow="hidden">
                    <SkeletonImage
                      src={question.image_url}
                      imageProps={{
                        h: "20",
                        objectFit: "contain"
                      }}
                      skeletonProps={{
                        h: "20",
                        objectFit: "contain"
                      }} />
                  </Flex>}
                </HStack>
              </Flex>
            )
          }) }
        </Flex>
      </Flex> }

      { viewMode === ViewMode.RESPONSES && <Flex
        p="8"
        flexDir="column"
        overflow="auto"
        flexGrow="1">
        { isOwner &&
        <Button
          mb="4"
          onClick={() => setViewMode(ViewMode.QUESTIONS)}>
          View Questions
        </Button> }
        <HStack gap="2">
          <Heading>Responses</Heading>
          <Tooltip label="Number of Responses">
            <Badge>{quiz.total_responses}</Badge>
          </Tooltip>
          <Tooltip label="Average Score">
            <Badge>AVG {Math.round((parseFloat(quiz.average_score) + Number.EPSILON) * 100) / 100}/{questions.length}</Badge>
          </Tooltip>
        </HStack>
        <Accordion
          allowMultiple={true}
          allowToggle={true}>
          { questions && questions.length === 0
          ? <Text>This quiz has no questions</Text>
          : questions.map((question: any, index: number) => {
            return (
              <AccordionItem
                mt="4"
                border="none">
                <AccordionButton p="0">
                  <Flex
                    w="full"
                    key={index}
                    p="4"
                    flexDir="column"
                    gap="2"
                    rounded="md"
                    bgColor="highlight">
                    <HStack justifyContent="space-between" w="full">
                      <HStack>
                        <AccordionIcon />
                        <Text><b>{index + 1}.</b> {question.question}</Text>
                      </HStack>
                      {question.image_url &&
                      <Flex
                        alignSelf="center"
                        mt="2"
                        rounded="md"
                        boxShadow="md"
                        overflow="hidden">
                        <SkeletonImage
                          src={question.image_url}
                          imageProps={{
                            h: "20",
                            objectFit: "contain"
                          }}
                          skeletonProps={{
                            h: "20",
                            objectFit: "contain"
                          }} />
                      </Flex>}
                    </HStack>
                  </Flex>
                </AccordionButton>
                <AccordionPanel>
                  <Flex
                    w="full"
                    key={index}
                    p="4"
                    flexDir="column"
                    gap="2"
                    rounded="md"
                    bgColor="highlight">
                    { question.responses.length === 0
                    ? <Text>This question has no answers</Text>
                    : "Chart"}
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            )
          }) }
        </Accordion>
      </Flex> }
    </Page>
  )
}

export default Quiz
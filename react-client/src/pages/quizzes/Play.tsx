import { AspectRatio, Badge, Button, Flex, Heading, HStack, Icon, Link, Spinner, Text, useColorMode, useDisclosure, VStack } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"
import Page from "../../features/layout/Page.layout"

import CoohootOwl from '../../assets/svg/CoohootOwl.svg'
import CoohootIcon from '../../assets/svg/CoohootIcon.svg'
import { IoMdExit, IoMdMoon, IoMdSunny } from "react-icons/io"
import ConfirmationModal from "../../features/layout/ConfirmationModal"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "../../api"
import NotFound from "../common/NotFound"
import SkeletonImage from "../../features/images/SkeletonImage"
import SkeletonAvatar from "../../features/images/SkeletonAvatar"
import MCQInput from "../../features/player/MCQInput"
import ShortAnswerInput from "../../features/player/ShortAnswerInput"

enum PageState {
  START,
  PLAYING,
  REVIEW
}

const Play: React.FC = () => {

  const { toggleColorMode, colorMode } = useColorMode()
  const navigate = useNavigate()
  const { quizId } = useParams()

  const [pageState, setPageState] = useState<PageState>(PageState.START)
  const [isPlaytest, setIsPlaytest] = useState<boolean>(false)
  const [quiz, setQuiz] = useState<any>(null)
  const [questions, setQuestions] = useState<any>(null)
  const [answers, setAnswers] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [currQnIndex, setCurrQnIndex] = useState<number>(0)

  const { onClose: onCEClose, onOpen: onCEOpen, isOpen: isCEOpen } = useDisclosure()

  useEffect(() => {
    console.log(questions)
  }, [questions])

  useEffect(() => {
    console.log(answers)
  }, [answers])

  const loadQuiz = async () => {
    setLoading(true)
    const quiz = await api.quizzes.getOne(quizId || "")
    setQuiz(quiz)
    if (quiz) {
      setIsPlaytest(!quiz.published)
      setQuestions(quiz?.questions.map((question: any) => {
        const { prev_question, quiz_id, ...rest } = question
        rest.type = question.type === 'mcq' ? 'MCQ' : 'Short Answer'
        return rest
      }))
      setAnswers(Array(quiz?.questions.length).fill(null))
    }
    setLoading(false)
  }

  useEffect(() => {
    loadQuiz()
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
    return <NotFound message="Quiz not found" />
  }

  const { thumbnail_url, title } = quiz
  const questionObj = questions[currQnIndex] || {}
  const { id, question, type, time, image_url, options } = questionObj

  return (
    <Page
      w="full"
      h="100vh">

      <ConfirmationModal
        onClose={onCEClose}
        isOpen={isCEOpen}
        callback={() => navigate(`/quiz/${quizId}`)}
        title="Exit Quiz"
        question="Are you sure you want to exit the quiz? Your responses will not be saved." />

      {/* Player Toolbar */}
      <Flex
        h="16"
        px="4"
        alignItems="center"
        justifyContent="space-between"
        boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
        zIndex="100">
        
        {/* Left */}
        <Flex
          gap="4"
          alignItems="center">
          <HStack>
            <CoohootIcon boxSize="8" />
            <Text fontSize="lg" color="brand">Quiz</Text>
          </HStack>
        </Flex>

        {/* Right */}
        <Flex gap="2">
          <Button
            display={{ base: "none", md: "flex" }}
            colorScheme="red"
            onClick={onCEOpen}
            leftIcon={<IoMdExit />}>
            Exit
          </Button>
          <Button
            display={{ base: "flex", md: "none" }}
            p="0"
            colorScheme="red"
            minW="unset"
            onClick={onCEOpen}
            variant="link">
            <Icon as={IoMdExit} boxSize="5" />
          </Button>
          <Button
            p={{
              base: "0",
              sm: "3"
            }}
            minW="unset"
            onClick={toggleColorMode}
            variant={{
              base: "link",
              sm: "ghost"
            }}>
            <Icon as={colorMode === 'light' ? IoMdMoon : IoMdSunny} boxSize="5" />
          </Button>
        </Flex>
      </Flex>

      { pageState === PageState.START &&
      <Page
        w="full"
        h="calc(100vh - 4rem)"
        flexDir="row"
        pt="8"
        justifyContent="center">

        <Flex
          flexDir="column"
          gap="2">
          <Heading fontSize="2xl">{ isPlaytest ? "Playtesting" : "Playing" }</Heading>
          <AspectRatio rounded="lg" boxShadow="md" ratio={16 / 9} w={["80vw", "70vw", "40vw"]}>
            <SkeletonImage
              imageProps={{ rounded: "lg" }}
              skeletonProps={{ rounded: "lg" }}
              src={thumbnail_url} />
          </AspectRatio>
          <Heading fontSize="3xl">{title}</Heading>
          <Flex
            flexDirection="column">
            <Text fontSize="sm">made by</Text>
            <Link variant="no-underline" color="brand">
              <HStack>
                <SkeletonAvatar border="2px solid" color="brand" src={quiz.owner.pfp_url} size="6" />
                <Text>{quiz.owner.username}</Text>
              </HStack>
            </Link>
          </Flex>
          <Button
            onClick={() => setPageState(PageState.PLAYING)}>
            Start
          </Button>
        </Flex>
        
      </Page> }

      { pageState === PageState.PLAYING && 
      <Page
        overflowY="scroll"
        w="full"
        h="calc(100vh - 4rem)"
        flexDir="column"
        pt="8"
        alignItems="center">
        <Heading fontSize="lg">Question {currQnIndex + 1}/{questions.length}</Heading>
        <HStack mt="1">
          <Badge colorScheme="brand" textTransform="unset">{type}</Badge>
          <Badge textTransform="unset">{time}s left</Badge>
        </HStack>
        <Flex
          m="4"
          p="4"
          rounded="md"
          flexDir="column"
          bgColor="highlight"
          gap="1">
          <Text textAlign="center">{question}</Text>
        </Flex>
        { image_url &&
        <Flex
          flexShrink="0"
          maxH="48"
          overflow="hidden"
          rounded="md"
          m="4"
          boxShadow="md">
          <SkeletonImage
            key={image_url}
            src={image_url}
            imageProps={{
              maxH: "48",
              objectFit: "contain"
            }}
            skeletonProps={{
              maxH: "48"
            }} />
        </Flex> }
        
        { type === "MCQ" &&
        <MCQInput
          key={id}
          id={id}
          options={options}
          qnIndex={currQnIndex}
          answer={answers[currQnIndex]}
          updateAnswer={(answer: string, qnIndex: number) => {
            setAnswers(answers.map((a: string, i: number) => i === qnIndex ? answer : a))
          }} /> }

        { type === "Short Answer" &&
        <ShortAnswerInput
          answer={answers[currQnIndex]}
          qnIndex={currQnIndex}
          updateAnswer={(answer: string, qnIndex: number) => {
            setAnswers(answers.map((a: string, i: number) => i === qnIndex ? (answer === "" ? null : answer) : a))
          }} /> }

        <HStack mt="4" mb="4">
          <Button onClick={() => setCurrQnIndex(i => i + 1)} isDisabled={currQnIndex === questions.length - 1 || answers[currQnIndex] === null}>
            Next
          </Button>
          <Button onClick={() => {}} isDisabled={answers.some((answer: any) => answer === null)}>
            Submit
          </Button>
        </HStack>
      </Page> }

    </Page>
  )
}

export default Play
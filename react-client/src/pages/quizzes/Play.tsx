import { AspectRatio, Badge, Button, Flex, Heading, HStack, Icon, Link, Spinner, Text, useColorMode, useDisclosure, VStack } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"
import Page from "../../features/layout/Page.layout"

import CoohootOwl from '../../assets/svg/CoohootOwl.svg'
import CoohootIcon from '../../assets/svg/CoohootIcon.svg'
import { IoMdCheckmark, IoMdClose, IoMdExit, IoMdMoon, IoMdSunny } from "react-icons/io"
import ConfirmationModal from "../../features/layout/ConfirmationModal"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import api from "../../api"
import NotFound from "../common/NotFound"
import SkeletonImage from "../../features/images/SkeletonImage"
import SkeletonAvatar from "../../features/images/SkeletonAvatar"
import MCQInput from "../../features/player/MCQInput"
import ShortAnswerInput from "../../features/player/ShortAnswerInput"
import useToast from "../../features/layout/useToast"

enum PageState {
  START,
  PLAYING,
  REVIEW
}

const parseRegex = (string: string) => {
  const a = string.split("/");
  const modifiers = a.pop();
  a.shift();
  const pattern = a.join("/");
  return new RegExp(pattern, modifiers);
}

const Play: React.FC = () => {

  const { toggleColorMode, colorMode } = useColorMode()
  const navigate = useNavigate()
  const toast = useToast()
  const { quizId } = useParams()

  const [pageState, setPageState] = useState<PageState>(PageState.START)
  const [isPlaytest, setIsPlaytest] = useState<boolean>(false)
  const [quiz, setQuiz] = useState<any>(null)
  const [questions, setQuestions] = useState<any>(null)
  const [answers, setAnswers] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [currQnIndex, setCurrQnIndex] = useState<number>(0)
  const [reviewResults, setReviewResults] = useState<any>(null)
  const [timer, setTimer] = useState<number>(0)
  const [submitting, setSubmitting] = useState<boolean>(false)

  let timerInterval = useRef<NodeJS.Timer | null>(null)

  const { onClose: onCEClose, onOpen: onCEOpen, isOpen: isCEOpen } = useDisclosure()

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

  const onSubmit = async () => {
    if (isPlaytest) {
      let score = 0
      const answerObjs: { answer: any; correct: boolean }[] = []
      questions.forEach((question: any, index: number) => {
        const answer = answers[index]
        const answerObj = { answer, correct: false }
        if (answer === null) {
          answerObjs.push(answerObj)
          return
        }
        if (question.type === 'MCQ') {
          if (question.answers.includes(answer)) {
            score++
            answerObj.correct = true
          }
        } else {
          if (question.answers.some((regex_answer: string) => new RegExp(parseRegex(regex_answer)).test(answer))) {
            score++
            answerObj.correct = true
          }
        }
        answerObjs.push(answerObj)
      })
      

      setReviewResults({
        score,
        answers: answerObjs
      })
      setPageState(PageState.REVIEW)
    } else {
      setSubmitting(true)
      const [success, results] = await api.quizzes.submitResponse(quizId as string, answers)
      if (success) {
        setReviewResults(results)
        setPageState(PageState.REVIEW)
      } else {
        toast.error("Quiz Submission Failed", "Quiz has stopped accepting submissions. Find another quiz to play.")
        navigate(`/discover`)
      }
      setSubmitting(false)
    }
  }

  const timerReset = (time: number) => {
    setTimer(time)
    if (timerInterval.current) clearInterval(timerInterval.current)
    setTimeout(() => {
      timerInterval.current = setInterval(() => {
        setTimer(t => {
          if (t === 1) {
            if (timerInterval.current !== null)
              clearInterval(timerInterval.current)
          }
          return t - 1
        })
      }, 1000)
    }, 1000)
  }

  const onNext = () => {
    timerReset(questions[currQnIndex + 1].time)
    setCurrQnIndex(i => i + 1)
  }

  const onStart = () => {
    setPageState(PageState.PLAYING)
    timerReset(questions[currQnIndex].time)
  }

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
            onClick={onStart}>
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
          <Badge textTransform="unset">{timer}s left</Badge>
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
        
        { timer !== 0 && type === "MCQ" &&
        <MCQInput
          key={id}
          id={id}
          options={options}
          qnIndex={currQnIndex}
          answer={answers[currQnIndex]}
          updateAnswer={(answer: string, qnIndex: number) => {
            setAnswers(answers.map((a: string, i: number) => i === qnIndex ? answer : a))
          }} /> }

        { timer !== 0 && type === "Short Answer" &&
        <ShortAnswerInput
          answer={answers[currQnIndex]}
          qnIndex={currQnIndex}
          updateAnswer={(answer: string, qnIndex: number) => {
            setAnswers(answers.map((a: string, i: number) => i === qnIndex ? (answer === "" ? null : answer) : a))
          }} /> }

        { timer === 0 &&
        <Flex
          flexDir="column"
          gap="2"
          alignItems="center">
            <Text textAlign="center">Time's up!</Text>
            { currQnIndex !== questions.length - 1
            ? <Text textAlign="center">Please move on to the next question</Text>
            : <Text textAlign="center">Please submit</Text>}
        </Flex> }


        <HStack mt="4" mb="4">
          <Button onClick={onNext} isDisabled={currQnIndex === questions.length - 1 || (answers[currQnIndex] === null && timer !== 0)}>
            Next
          </Button>
          <Button
            isLoading={submitting}
            loadingText="Submitting..."
            onClick={onSubmit}
            isDisabled={(answers[questions.length - 1] === null && timer !== 0) || (answers[questions.length - 1] !== null && timer === 0)}>
            Submit
          </Button>
        </HStack>

      </Page> }

      { pageState === PageState.REVIEW && 
      <Page
        overflowY="scroll"
        w="full"
        h="calc(100vh - 4rem)"
        flexDir="column"
        pt="8"
        alignItems="center">
          
        <Heading fontSize="lg">Review</Heading>

        <Text mt="4" mb="4">You scored {reviewResults.score} out of {questions.length}</Text>

        { reviewResults.answers.map((answer: any, i: number) => {
          const { id, question, type, options, image_url } = questions[i]
          return (
            <Flex
              position="relative"
              key={id}
              m="4"
              p="4"
              rounded="md"
              flexDir="column"
              bgColor="highlight"
              gap="1">
              <Text textAlign="center" fontSize="sm" fontWeight="bold">Question {i + 1}</Text>
              <Text textAlign="center">{question}</Text>
              { image_url &&
              <Flex
                alignSelf="center"
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
              <Text textAlign="center" fontSize="sm" fontWeight="bold">Your Answer</Text>
              { answer.answer === null
              ? <Text textAlign="center">Unattempted</Text>
              : <Text textAlign="center">{type === "MCQ" ? options.filter((opt: any) => opt.id === answer.answer)[0].value : answer.answer}</Text> }
              <Flex
                position="absolute"
                top="3"
                right="3"
                bgColor={answer.correct ? "green" : "red"}
                color="white"
                rounded="md"
                h="6"
                w="6"
                alignItems="center"
                justifyContent="center">
                <Icon as={answer.correct ? IoMdCheckmark : IoMdClose} />
              </Flex>
            </Flex>
          )
        })}

        <Button
          flexShrink="0"
          mt="4"
          mb="2"
          onClick={() => navigate(`/quiz/${quizId}`)}>
          End Quiz
        </Button>

        <Button
          mb="8"
          textAlign="center"
          fontSize="sm"
          variant="link"
          onClick={() => {
            setAnswers(Array(questions.length).fill(null))
            setCurrQnIndex(0)
            setPageState(PageState.START)
          }}>
          Play again?
        </Button>

      </Page> }

    </Page>
  )
}

export default Play
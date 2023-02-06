import { Heading, Spinner, Text, VStack, Flex, Button, useDisclosure, Icon, useColorMode, HStack, chakra, Editable, EditablePreview, EditableInput } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api'
import Page from "../../features/layout/Page.layout"

import CoohootOwl from '../../assets/svg/CoohootOwl.svg'
import CoohootIcon from '../../assets/svg/CoohootIcon.svg'
import NotFound from '../common/NotFound'
import { useAuth } from '../../features/auth/AuthContext'
import { IoMdAdd, IoMdCloudUpload, IoMdCreate, IoMdExit, IoMdMoon, IoMdSave, IoMdSunny } from 'react-icons/io'
import EditQuizModal from '../../features/quizzes/EditQuizModal'
import { Reorder } from 'framer-motion'
import QuestionCard from '../../features/editor/QuestionCard'
import QuestionImage from '../../features/editor/QuestionImage'

const Editor: React.FC = () => {

  const { quizId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { colorMode, toggleColorMode } = useColorMode()

  const [quiz, setQuiz] = useState<any>(null)
  const [questions, setQuestions] = useState<any>(null)
  const [selectedId, setSelectedId] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const loadQuiz = async () => {
    setLoading(true)
    const quiz = await api.quizzes.getOne(quizId || "")
    setQuiz(quiz)
    setQuestions(quiz?.questions)
    setLoading(false)
  }

  useEffect(() => {
    loadQuiz()
  }, [])

  const { onClose: onEQClose, onOpen: onEQOpen, isOpen: isEQOpen } = useDisclosure()

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
    return <NotFound />
  }

  const { title, description, thumbnail_url, visibility, published, owner, id } = quiz
  const { username, pfp_url } = owner
  const selectedQuestion = questions?.find((q: any) => q.id === selectedId)

  const updateSelectedQuestion = (values: any) => {
    setQuestions(questions.map((q: any) => q.id === selectedId ? { ...q, ...values } : q))
  }

  const onUpdateDetails = (values: any) => {
    setQuiz({ ...quiz, ...values })
  }

  const addQuestion = () => {
    const id = `local$${Math.random().toString(36).slice(2)}`
    setQuestions([
      ...questions,
      {
        id,
        question: null,
        type: "MCQ",
        time: 30,
        image_url: null,
        options: [],
        answers: []
      }
    ])
    setSelectedId(id)
  }

  const deleteQuestion = (id: string) => {
    if (id === selectedId) setSelectedId(null)
    setQuestions(questions.filter((q: any) => q.id !== id))
  }

  return (
    <Page
      w="full"
      h="100vh">
      
      <EditQuizModal onClose={onEQClose} isOpen={isEQOpen} updateDetails={onUpdateDetails} quiz={quiz} />

      {/* Editor Toolbar */}
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
            <Text fontSize="lg" color="brand">Quiz Editor</Text>
          </HStack>
        </Flex>

        {/* Right */}
        <Flex gap="2">
          <Button
            onClick={() => {}}
            leftIcon={<IoMdSave />}>
            Save
          </Button>
          <Button
            colorScheme="red"
            onClick={() => navigate(`/quiz/${id}`)}
            leftIcon={<IoMdExit />}>
            Exit
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

      <Page
        w="full"
        h="calc(100vh - 4rem)"
        flexDir="row">
        
        {/* Left Sidebar */}
        <VStack
          w="15%"
          maxW="15%"
          h="full"
          overflowY="scroll"
          alignItems="stretch"
          p="4"
          pt="0"
          position="relative">
          <VStack
            bgColor="var(--chakra-colors-chakra-body-bg)"
            position="sticky"
            top="0"
            pt="4"
            alignItems="stretch"
            zIndex="50">
            <Button
              flexShrink="0"
              leftIcon={<IoMdCreate />}
              onClick={onEQOpen}
              mb="2">
              Edit Details
            </Button>
            <Text fontSize="lg" mb="2">Questions</Text>
          </VStack>
          <VStack
            as={Reorder.Group}
            axis="y"
            // overflowY="scroll"
            listStyleType="none"
            sx={{ listDecoration: "none" }}
            values={questions}
            onReorder={setQuestions}
            gap="2"
            alignItems="flex-start">
            { (questions && questions.length === 0)
            ? <Text>No questions yet</Text>
            : questions.map((question: any, index: number) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index}
                isSelected={selectedId === question.id}
                onSelect={setSelectedId}
                onDelete={deleteQuestion} />
            )) }
          </VStack>
          <Button
            flexShrink="0"
            variant="ghost"
            leftIcon={<IoMdAdd />}
            onClick={addQuestion}>
            Add Question
          </Button>
        </VStack>

        
        <Flex
          p="8"
          overflowY="scroll"
          flexDir="column"
          flexGrow="1">

          { selectedId === null
          ? <Text fontSize="lg">Select a question to edit</Text>
          : <Flex
              flexDir="column"
              alignItems="stretch"
              textAlign="center"
              gap="4"
              flexGrow="1">
              <Flex
                rounded="md"
                flexDir="column"
                p="4"
                background="highlight">
                <Text fontSize="xl">Question</Text>
                <Editable
                  overflowWrap="break-word"
                  placeholder="Type your question here"
                  defaultValue={selectedQuestion.question}
                  onChange={val => updateSelectedQuestion({ question: val })}>
                  <EditablePreview />
                  <EditableInput />
                </Editable>
              </Flex>
              <QuestionImage initialImage={quiz.image_url} updateImage={
                (image: string | null) => updateSelectedQuestion({ image_url: image })
              } />
              {/* Options */}
          </Flex> }

          
        </Flex>

        {/* Right Sidebar */}
        { selectedId !== null &&
        <VStack
          h="full"
          overflowY="scroll"
          alignItems="stretch"
          p="4">
          
          <Text fontSize="lg">Question Settings</Text>
        </VStack> }

      </Page>

    </Page>
  )
}

export default Editor
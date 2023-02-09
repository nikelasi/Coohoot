import { Heading, Spinner, Text, VStack, Flex, Button, useDisclosure, Icon, useColorMode, HStack, chakra, Editable, EditablePreview, EditableInput, FormControl, FormLabel, Select, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Tooltip } from '@chakra-ui/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api'
import Page from "../../features/layout/Page.layout"

import CoohootOwl from '../../assets/svg/CoohootOwl.svg'
import CoohootIcon from '../../assets/svg/CoohootIcon.svg'
import NotFound from '../common/NotFound'
import { useAuth } from '../../features/auth/AuthContext'
import { IoMdAdd, IoMdCreate, IoMdExit, IoMdMoon, IoMdSave, IoMdSunny, IoMdWarning } from 'react-icons/io'
import EditQuizModal from '../../features/quizzes/EditQuizModal'
import { Reorder } from 'framer-motion'
import QuestionCard from '../../features/editor/QuestionCard'
import QuestionImage from '../../features/editor/QuestionImage'
import MCQAnswers from '../../features/editor/MCQAnswers'
import ShortAnswerAnswers from '../../features/editor/ShortAnswerAnswers'
import ConfirmationModal from '../../features/layout/ConfirmationModal'
import InvalidQuestionsModal from '../../features/editor/InvalidQuestionsModal'
import useToast from '../../features/layout/useToast'

const Editor: React.FC = () => {

  const { quizId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const { colorMode, toggleColorMode } = useColorMode()

  const [quiz, setQuiz] = useState<any>(null)
  const [questions, setQuestions] = useState<any>(null)
  const [selectedId, setSelectedId] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)

  const loadQuiz = async () => {
    setLoading(true)
    const quiz = await api.quizzes.getOne(quizId || "")
    setQuiz(quiz)
    setQuestions(quiz?.questions.map((question: any) => {
      const { prev_question, quiz_id, ...rest } = question
      rest.type = question.type === 'mcq' ? 'MCQ' : 'Short Answer'
      return rest
    }))
    setLoading(false)
  }

  const isQuestionValid = (question: any) => {
    const { questionText, type, options, answers } = question
    console.log(question)
    if (questionText === "") {
      return false
    }
    if (type === 'MCQ') {
      if (options.every((option: any) => option.value !== undefined && option.id !== undefined)) {
        if (options.some((option: any) => option.value === "")) {
          return false
        }
      }
      if (answers.length < 1) {
        return false
      }
    } else if (type === 'Short Answer') {
      if (answers.every((answer: any) => answer.match(/^\/\^(.*)\$\/(i?)$/))) {
        if (answers.some((answer: any) => answer.match(/^\/\^(.*)\$\/(i?)$/)[1] === "")) {
          return false
        }
      }
    }
    return true
  }
  
  const isValid = useMemo(() => questions ? questions.every(isQuestionValid) : false, [questions])

  useEffect(() => {
    loadQuiz()
  }, [])

  const { onClose: onEQClose, onOpen: onEQOpen, isOpen: isEQOpen } = useDisclosure()
  const { onClose: onCEClose, onOpen: onCEOpen, isOpen: isCEOpen } = useDisclosure()
  const { onClose: onIQClose, onOpen: onIQOpen, isOpen: isIQOpen } = useDisclosure()

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

  const { id } = quiz
  const selectedQuestion = questions?.find((q: any) => q.id === selectedId)
  const { answers, options, type, time, image_url } = selectedQuestion || {}

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
        question: "",
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

  const onSave = async () => {
    setSaving(true)
    const [success, updatedQuestions] = await api.quizzes.saveQuestions(id, questions)
    if (success) {
      toast.success("Save successful", "Your quiz has been saved.")
      const currQnIndex = quiz.questions.findIndex((question: any) => question.id === selectedId)
      setQuestions(updatedQuestions.map((question: any) => {
        const { prev_question, quiz_id, ...rest } = question
        rest.type = question.type === 'mcq' ? 'MCQ' : 'Short Answer'
        return rest
      }))
      setSelectedId(updatedQuestions[currQnIndex]?.id || quiz?.questions[0]?.id)
    } else {
      toast.error("Save failed", "Your quiz could not be saved. Please try again later.")
    }
    setSaving(false)
  }

  return (
    <Page
      w="full"
      h="100vh">
      
      <EditQuizModal onClose={onEQClose} isOpen={isEQOpen} updateDetails={onUpdateDetails} quiz={quiz} />
      <InvalidQuestionsModal onClose={onIQClose} isOpen={isIQOpen} questions={questions} setSelectedQuestion={setSelectedId} />
      <ConfirmationModal onClose={onCEClose} isOpen={isCEOpen} callback={() => navigate(`/quiz/${id}`)}
        title="Exit Quiz Editor"
        question="Are you sure you want to exit the quiz editor? All unsaved changes will be lost." />

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
            isLoading={saving}
            loadingText="Saving..."
            onClick={isValid ? onSave : onIQOpen}
            leftIcon={<IoMdSave />}>
            Save
          </Button>
          <Button
            colorScheme="red"
            onClick={onCEOpen}
            leftIcon={<IoMdExit />}
            isDisabled={saving}>
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

        {/* Main */}
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

              {/* Question Text */}
              <Flex
                position="relative"
                rounded="md"
                flexDir="column"
                p="4"
                background="highlight">
                <Text fontSize="xl">Question</Text>
                <Editable
                  overflowWrap="break-word"
                  placeholder="Type your question here"
                  value={selectedQuestion.question}
                  onChange={val => updateSelectedQuestion({ question: val })}>
                  <EditablePreview />
                  <EditableInput />
                </Editable>
                <Tooltip colorScheme="red" label="question text must be filled in">
                  <Flex
                    display={selectedQuestion.question === "" ? "flex" : "none"}
                    position="absolute"
                    top="4"
                    left="4"
                    bgColor="red"
                    color="white"
                    rounded="md"
                    h="6"
                    w="6"
                    alignItems="center"
                    justifyContent="center">
                    <Icon as={IoMdWarning} />
                  </Flex>
                </Tooltip>
              </Flex>

              {/* Image */}
              <QuestionImage initialImage={image_url} updateImage={
                (image: string | null) => updateSelectedQuestion({ image_url: image })
              } />

              {/* Answers */}
              { type === 'MCQ' &&
              <MCQAnswers
                answers={answers}
                options={options}
                updateAnswers={(answers: any) => updateSelectedQuestion({ answers })}
                updateOptions={(options: any) => updateSelectedQuestion({ options })} /> }
              { type === 'Short Answer' &&
              <ShortAnswerAnswers
                answers={answers}
                updateAnswers={(answers: any) => updateSelectedQuestion({ answers })} /> }
          </Flex> }

          
        </Flex>

        {/* Right Sidebar */}
        { selectedId !== null &&
        <VStack
          w="15%"
          h="full"
          overflowY="scroll"
          alignItems="stretch"
          p="4">
          
          <Text fontSize="lg">Question Settings</Text>

          <FormControl>
            <FormLabel>Type</FormLabel>
            <Select
              value={type}
              onChange={(e) => updateSelectedQuestion({ type: e.target.value, answers: [], options: [] })}>
              <option value="MCQ">MCQ</option>
              <option value="Short Answer">Short Answer</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Time (s)</FormLabel>
            <NumberInput value={time} min={10} max={300} onChange={val => updateSelectedQuestion({ time: parseInt(val) })}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </VStack> }

      </Page>

      {/* Block non desktop */}
      <Flex
        display={{
          base: "flex",
          lg: "none"
        }}
        position="fixed"
        inset="0"
        bgColor="var(--chakra-colors-chakra-body-bg)"
        zIndex="100"
        alignItems="center"
        justifyContent="center">
        
        <VStack>
          <CoohootOwl boxSize="32" />
          <Text fontSize="2xl" color="brand" textAlign="center">Sorry... editor only available on desktop</Text>
          <Button
            colorScheme="red"
            onClick={() => navigate(`/quiz/${id}`)}
            leftIcon={<IoMdExit />}>
            Exit
          </Button>
        </VStack>
      </Flex>

    </Page>
  )
}

export default Editor
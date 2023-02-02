import { Heading, Spinner, Text, VStack, Flex, Button, useDisclosure } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../api'
import Page from "../../features/layout/Page.layout"

import CoohootOwl from '../../assets/svg/CoohootOwl.svg'
import NotFound from '../common/NotFound'
import { useAuth } from '../../features/auth/AuthContext'
import { IoMdCreate } from 'react-icons/io'
import EditQuizModal from '../../features/quizzes/EditQuizModal'

const Editor: React.FC = () => {

  const { quizId } = useParams()
  const { user } = useAuth();

  const [quiz, setQuiz] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const loadQuiz = async () => {
    setLoading(true)
    const quiz = await api.quizzes.getOne(quizId || "")
    setQuiz(quiz)
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
  const isOwner = user.username === username

  const onUpdateDetails = (values: any) => {
    setQuiz({ ...quiz, ...values })
  }

  return (
    <Page
      w="full"
      p="4"
      flexDirection={{ base: "column", md: "row" }}>

      <EditQuizModal onClose={onEQClose} isOpen={isEQOpen} updateDetails={onUpdateDetails} quiz={quiz} />

      <VStack
        gap="4">
        <Button
          onClick={onEQOpen}
          leftIcon={<IoMdCreate />}>
          Edit Quiz Details
        </Button>
      </VStack>

      <Flex
        p="8"
        flexDir="column"
        overflow="auto"
        flexGrow="1">
        
      </Flex>
    </Page>
  )
}

export default Editor
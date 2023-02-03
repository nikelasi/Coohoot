import { Heading, Spinner, Text, VStack, Flex, Button, useDisclosure, Icon, useColorMode, HStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../api'
import Page from "../../features/layout/Page.layout"

import CoohootOwl from '../../assets/svg/CoohootOwl.svg'
import CoohootIcon from '../../assets/svg/CoohootIcon.svg'
import NotFound from '../common/NotFound'
import { useAuth } from '../../features/auth/AuthContext'
import { IoMdCreate, IoMdExit, IoMdMoon, IoMdSunny } from 'react-icons/io'
import EditQuizModal from '../../features/quizzes/EditQuizModal'

const Editor: React.FC = () => {

  const { quizId } = useParams()
  const { user } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode()

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
      h="100vh">
      
      <EditQuizModal onClose={onEQClose} isOpen={isEQOpen} updateDetails={onUpdateDetails} quiz={quiz} />

      {/* Editor Toolbar */}
      <Flex
        h="16"
        px="4"
        alignItems="center"
        justifyContent="space-between"
        boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)">
        
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
            colorScheme="red"
            onClick={() => {}}
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
        p="4">
        <VStack
          gap="4">
          
        </VStack>

        <Flex
          p="8"
          flexDir="column"
          overflow="auto"
          flexGrow="1">
          
        </Flex>

      </Page>

    </Page>
  )
}

export default Editor
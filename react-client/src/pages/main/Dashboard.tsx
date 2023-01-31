import { Flex, Heading, HStack, Text, Image, Button, VStack, Link, Tabs, TabList, Tab, InputGroup, InputLeftElement, Icon, Input, TabPanels, TabPanel, FormControl, FormLabel, InputRightElement, useDisclosure, HeadingProps, Divider, SimpleGrid, Spinner } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { IoMdAddCircle, IoMdBrowsers, IoMdCode, IoMdCreate, IoMdPerson, IoMdSearch, IoMdTrash } from 'react-icons/io'
import { useAuth } from '../../features/auth/AuthContext'
import useAuthWall from '../../features/auth/useAuthWall'
import Page from "../../features/layout/Page.layout"
import QuizDiscovery from '../../features/discovery/QuizDiscovery'
import SessionDiscovery from '../../features/discovery/SessionDiscovery'
import { useState } from 'react'
import { MdExplore } from 'react-icons/md'
import WIPModal from '../../features/layout/WIPModal'
import DeleteUserModal from '../../features/users/DeleteUserModal'
import EditProfileModal from '../../features/users/EditProfileModal'
import SkeletonAvatar from '../../features/images/SkeletonAvatar'
import CreateQuizModal from '../../features/quizzes/CreateQuizModal'
import api from '../../api'
import usePaginator from '../../features/discovery/usePaginator'
import QuizCard from '../../features/quizzes/QuizCard'
import EditableQuizCard from '../../features/quizzes/EditableQuizCard'

interface DashboardHeadingProps {
  desktopOnly?: boolean;
}

const DashboardHeading: React.FC<DashboardHeadingProps> = ({ desktopOnly = false }: DashboardHeadingProps) => {
  return (
    <Heading
      gap="2"
      alignItems="center"
      display={{
        base: !desktopOnly ? "flex" : "none",
        md: desktopOnly ? "flex" : "none"
      }}>
      <IoMdBrowsers fill="var(--chakra-colors-brand)" />
      Dashboard
    </Heading>
  )
}

const Dashboard: React.FC = () => {

  useAuthWall()

  const { user } = useAuth()
  const { username, email, pfp_url } = user || {}

  const { onOpen: onWIPOpen, isOpen: isWIPOpen, onClose: onWIPClose } = useDisclosure()
  const { onOpen: onDUOpen, isOpen: isDUOpen, onClose: onDUClose } = useDisclosure()
  const { onOpen: onEPOpen, isOpen: isEPOpen, onClose: onEPClose } = useDisclosure()
  const { onOpen: onCQOpen, isOpen: isCQOpen, onClose: onCQClose } = useDisclosure()

  const { Paginator, items, isLoading, reloadPage } = usePaginator({
    paginatorApi: api.quizzes.getMinePaginated()
  })

  return (
    <Page
      w="full"
      p="4"
      gap="4">

      <WIPModal isOpen={isWIPOpen} onClose={onWIPClose} />
      <DeleteUserModal isOpen={isDUOpen} onClose={onDUClose} />
      <EditProfileModal isOpen={isEPOpen} onClose={onEPClose} />
      <CreateQuizModal isOpen={isCQOpen} onClose={onCQClose} reload={reloadPage} />
      
      <DashboardHeading />

      <Flex
        gap="4"
        flexGrow="1"
        flexDirection={{
          base: "column",
          md: "row"
        }}>

        {/* START: Actions & Profile Panel */}
        <Flex
          p="4"
          bgColor="highlight"
          borderRadius="md"
          flexDirection="column"
          h="100%"
          gap="6"
          w={{
            base: "100%",
            md: "auto"
          }}
          pos={{
            base: "static",
            md: "sticky"
          }}
          top={{
            base: undefined,
            md: "20"
          }}>

          <DashboardHeading desktopOnly />

          {/* START: Profile Section */}
          <VStack
            gap="2"
            w="full"
            alignItems="stretch">
            <Text>Your Profile</Text>

            {/* Profile Card */}
            <HStack
              gap="2"
              alignItems="center">
              <SkeletonAvatar
                border="3px solid"
                size="16"
                color="brand"
                src={pfp_url} />
              <VStack
                alignItems="flex-start"
                overflow="auto">
                <Text
                  lineHeight="8"
                  color="brand.accent"
                  fontSize="3xl"
                  noOfLines={1}
                  maxWidth={{
                    base: "100%",
                    md: "25vw"
                  }}>
                  {username}
                </Text>
                <Text
                  marginTop="0px"
                  marginBlockStart="0"
                  color="brand"
                  fontSize="md"
                  noOfLines={1}
                  maxWidth={{
                    base: "100%",
                    md: "25vw"
                  }}>
                  {email}
                </Text>
              </VStack>
            </HStack>

            {/* Profile Actions */}
            <Flex
              flexDirection="column"
              gap="2">
              <Link
                as={RouterLink}
                to={`/user/${username}`}
                variant="no-underline">
                <Button
                  leftIcon={<IoMdPerson />}
                  w="full">
                  View Profile
                </Button>
              </Link>
              <Button
                onClick={onEPOpen}
                leftIcon={<IoMdCreate />}>
                Edit Profile
              </Button>
              <Button
                onClick={onDUOpen}
                colorScheme="red"
                leftIcon={<IoMdTrash />}>
                Delete Account
              </Button>
            </Flex>

          </VStack>
          {/* END: Profile Section */}

          {/* START: Actions Section */}
          <VStack
            gap="2"
            w="full"
            alignItems="stretch">
            <Text>Actions</Text>

            <VStack
              w="full"
              alignItems="stretch">
              <Link
                as={RouterLink}
                to={`/discover`}
                variant="no-underline">
                <Button
                  leftIcon={<MdExplore />}
                  w="full">
                  Discover Coohoots
                </Button>
              </Link>
              <Button
                onClick={onCQOpen}
                leftIcon={<IoMdAddCircle />}>
                Create a Quiz
              </Button>
            </VStack>

          </VStack>
        </Flex>
        {/* END: Actions & Profile Panel */}

        <Divider display={{ base: "block", md: "none" }} />

        {/* START: User's Quiz Listing */}
        <Flex
          flexGrow="1"
          flexDirection="column"
          gap="4">
          
          <Heading>
            Your coohoots
            <Text
              fontSize="lg">
              Quizzes you have made
            </Text>
          </Heading>
          
          <InputGroup>
            <InputLeftElement
              children={<Icon as={IoMdSearch} boxSize="6" color="gray.300" />} />
            <Input
              variant="filled"
              colorScheme="highlight"
              w="full"
              placeholder="Search quizzes..." />
          </InputGroup>
          <Flex
            flexGrow="1"
            direction="column"
            gap="4"
            bgColor="highlight"
            borderRadius="lg"
            p="4">
            <Paginator />
            { isLoading ?
              <Flex
                flexGrow="1"
                alignItems="center"
                justifyContent="center">
                <Spinner size="xl" thickness="5px" color="brand" />
              </Flex> :
              <Flex
                flexGrow="1">
                { items && items.length !== 0
                ? <SimpleGrid
                  w="full"
                  alignSelf="flex-start"
                  gap="4"
                  columns={{
                    sm: 2,
                    md: 3,
                    lg: 4
                  }}>
                  {items.map((quiz: any) => {
                    return <EditableQuizCard
                      quiz={quiz}
                      key={quiz.id} />
                  })}
                </SimpleGrid>
                : "No quizzes found" }
              </Flex>
            }
            <Flex
              alignSelf="flex-end">
              <Paginator />
            </Flex>
          </Flex>

        </Flex>
        {/* END: User's Quiz/Session Listing */}
        
      </Flex>
    </Page>
  )
}

export default Dashboard
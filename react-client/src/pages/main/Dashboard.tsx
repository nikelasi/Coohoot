import { Flex, Heading, HStack, Text, Image, Button, VStack, Link, Tabs, TabList, Tab, InputGroup, InputLeftElement, Icon, Input, TabPanels, TabPanel, FormControl, FormLabel, InputRightElement, useDisclosure } from '@chakra-ui/react'
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

const Dashboard: React.FC = () => {

  useAuthWall()

  const [tab, setTab] = useState("quizzes")

  const { user } = useAuth()
  const { username, email, pfp_url } = user || {}

  const { onOpen: onWIPOpen, isOpen: isWIPOpen, onClose: onWIPClose } = useDisclosure()

  return (
    <Page
      w="full"
      p="4"
      gap="4">

      <WIPModal isOpen={isWIPOpen} onClose={onWIPClose} />
      
      <Heading
        display="flex"
        gap="2"
        alignItems="center">
        <IoMdBrowsers fill="var(--chakra-colors-brand)" />
        Dashboard
      </Heading>

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
          gap="6"
          w={{
            base: "100%",
            md: "auto"
          }}>

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
              <Image
                borderRadius="100%"
                border="3px solid"
                borderColor="brand"
                boxSize="16"
                src={pfp_url}
                alt={`${username}'s profile photo`} />
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
                onClick={onWIPOpen}
                leftIcon={<IoMdCreate />}>
                Edit Profile
              </Button>
              <Button
                onClick={onWIPOpen}
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
                onClick={onWIPOpen}
                leftIcon={<IoMdAddCircle />}>
                Create a Quiz
              </Button>
            </VStack>

            <HStack>
              <FormControl>
                <FormLabel>Join a Live Session</FormLabel>
                <InputGroup
                  size="sm">
                  <InputLeftElement
                    children={<Icon as={IoMdCode} fill="brand.accent" boxSize="4" />}/>
                  <Input
                    variant="flushed"
                    pr="12"
                    id="name"
                    name="name"
                    placeholder="Session Code" />
                </InputGroup>
              </FormControl>
              <Button
                onClick={onWIPOpen}
                size="sm"
                alignSelf="flex-end">
                Join
              </Button>
            </HStack>

          </VStack>
        </Flex>
        {/* END: Actions & Profile Panel */}

        {/* START: User's Quiz/Session Listing */}
        <Flex
          flexGrow="1"
          flexDirection="column"
          gap="4">
          
          <Heading>
            Your coohoots
            <Text
              fontSize="lg">
              Quizzes and sessions you've created or started
            </Text>
          </Heading>
          
          <Tabs
            flexGrow="1"
            defaultIndex={0}
            onChange={(index) => {
              setTab(index === 0 ? "quizzes" : "sessions")
            }}
            variant="soft-rounded"
            display="flex"
            flexDirection="column"
            gap="4">
            <Flex
              flexDirection={{
                base: 'column',
                md: 'row'
              }}
              gap="4">
              <TabList
                position="sticky"
                gap="2">
                <Tab>Quizzes</Tab>
                <Tab>Sessions</Tab>
              </TabList>
              <InputGroup>
                <InputLeftElement
                  children={<Icon as={IoMdSearch} boxSize="6" color="gray.300" />} />
                <Input
                  variant="filled"
                  colorScheme="highlight"
                  w="full"
                  placeholder={`Search ${tab}...`} />
              </InputGroup>
            </Flex>
            <TabPanels
              flexGrow="1"
              display="flex">
              <TabPanel
                p="0"
                flexGrow="1"
                display="flex">
                <QuizDiscovery />
              </TabPanel>
              <TabPanel
                p="0"
                flexGrow="1"
                display="flex">
                <SessionDiscovery />
              </TabPanel>
            </TabPanels>
          </Tabs>

        </Flex>
        {/* END: User's Quiz/Session Listing */}
        
      </Flex>
    </Page>
  )
}

export default Dashboard
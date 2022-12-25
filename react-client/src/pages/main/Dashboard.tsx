import { Flex, Heading, HStack, Text, Image, Button, VStack, Link, Tabs, TabList, Tab, InputGroup, InputLeftElement, Icon, Input, TabPanels, TabPanel } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { IoMdBrowsers, IoMdPerson, IoMdSearch } from 'react-icons/io'
import { useAuth } from '../../features/auth/AuthContext'
import useAuthWall from '../../features/auth/useAuthWall'
import Page from "../../features/layout/Page.layout"
import QuizDiscovery from '../../features/discovery/QuizDiscovery'
import SessionDiscovery from '../../features/discovery/SessionDiscovery'
import { useState } from 'react'

const Dashboard: React.FC = () => {

  useAuthWall()

  const [tab, setTab] = useState("quizzes")

  const { user } = useAuth()
  const { username, email, pfp_url } = user || {}

  return (
    <Page
      p="4"
      gap="4">
      
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

        {/* START: User's Profile & Actions */}
        <Flex
          p="4"
          bgColor="highlight"
          borderRadius="md"
          flexDirection="column"
          w={{
            base: "100%",
            md: "auto"
          }}>

          {/* Profile */}
          <VStack
            gap="2"
            w="full"
            alignItems="stretch">
            <Text>Your Profile</Text>
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
                alignItems="flex-start">
                <Text
                  lineHeight="5"
                  color="brand.accent"
                  fontSize="3xl">
                  {username}
                </Text>
                <Text
                  marginTop="0px"
                  marginBlockStart="0"
                  color="brand"
                  fontSize="md">
                  {email}
                </Text>
              </VStack>
            </HStack>
            <Link as={RouterLink} to={`/user/${username}`}>
              <Button
                leftIcon={<IoMdPerson />}
                w="full">
                View Profile
              </Button>

            </Link>
          </VStack>
        </Flex>
        {/* END: User's Profile & Actions */}

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
import { Flex, Heading, Icon, Input, InputGroup, InputLeftElement, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { IoMdSearch } from 'react-icons/io'
import { useSearchParams } from 'react-router-dom'
import QuizDiscovery from '../../features/discovery/QuizDiscovery'
import SessionDiscovery from '../../features/discovery/SessionDiscovery'
import Page from "../../features/layout/Page.layout"

const Discover: React.FC = () => {

  const [searchParams, setSearchParams] = useSearchParams()
  const [tab, setTab] = useState(searchParams.get("tab") || "quizzes")

  useEffect(() => {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      tab
    })
  }, [tab])

  return (
    <Page
      w="full"
      p="8"
      gap="4">
      <Heading>
        Discovery
        <Text
          fontSize="lg">
          Explore quizzes and sessions
        </Text>
      </Heading>
      {/* Quiz / Session Discovery */}
      <Tabs
        flexGrow="1"
        // tabIndex={tab === "quizzes" ? 0 : 1}
        defaultIndex={tab === "quizzes" ? 0 : 1}
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
    </Page>
  )
}

export default Discover
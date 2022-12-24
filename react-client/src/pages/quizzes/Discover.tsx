import { Heading, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import QuizDiscovery from '../../features/discovery/QuizDiscovery'
import SessionDiscovery from '../../features/discovery/SessionDiscovery'
import Page from "../../features/layout/Page.layout"

const Discover: React.FC = () => {

  return (
    <Page
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
        defaultIndex={0}
        variant="soft-rounded"
        display="flex"
        flexDirection="column"
        gap="4">
        <TabList
          position="sticky"
          gap="2">
          <Tab>Quizzes</Tab>
          <Tab>Sessions</Tab>
        </TabList>
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
import { Heading, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
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
          Explore quizzes and templates
        </Text>
      </Heading>
      {/* Quiz / Template Discovery */}
      <Tabs
        defaultIndex={0}
        variant="soft-rounded">
        <TabList
          position="sticky"
          gap="2">
          <Tab>Quizzes</Tab>
          <Tab>Templates</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>Quiz discovery</TabPanel>
          <TabPanel>Template discovery</TabPanel>
        </TabPanels>
      </Tabs>
    </Page>
  )
}

export default Discover
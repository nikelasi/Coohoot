import { Tab, Tabs, TabList, TabPanel, TabPanels } from "@chakra-ui/react"
import LoginForm from "../../features/auth/LoginForm";
import RegisterForm from "../../features/auth/RegisterForm";
import OwlPage from "../../features/layout/OwlPage.layout"

interface FormsProps {
  isLogin?: boolean;
}

const Forms: React.FC<FormsProps> = ({ isLogin = false }: FormsProps) => {

  const defaultTabIndex = isLogin ? 1 : 0;

  return (
    <OwlPage
      p="16"
      gap="8">
      <Tabs
        size="lg"
        isFitted
        variant='line'
        defaultIndex={defaultTabIndex}>
        <TabList gap="2">
          <Tab fontSize="xl" borderTopRadius="lg">Register</Tab>
          <Tab fontSize="xl" borderTopRadius="lg">Login</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p="0" pt="4">
            {/* Register */}
            <RegisterForm />
          </TabPanel>
          <TabPanel p="0" pt="4">
            {/* Login */}
            <LoginForm />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </OwlPage>
  )
}

export default Forms
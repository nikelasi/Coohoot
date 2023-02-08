import { Tab, Tabs, TabList, TabPanel, TabPanels, Heading, Text } from "@chakra-ui/react"
import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import LoginForm from "../../features/auth/LoginForm";
import RegisterForm from "../../features/auth/RegisterForm";
import OwlPage from "../../features/layout/OwlPage.layout"

const AuthWall: React.FC = () => {

  const { token } = useAuth()

  const [params,] = useSearchParams()
  const redirect = params.get('redirect')

  const navigate = useNavigate()

  useEffect(() => {
    if (!redirect) {
      navigate('/')
    } else {
      if (token) {
        navigate(redirect)
      }
    }
  }, [])

  return (
    <OwlPage
      owlType="cop"
      p={{
        base: "4",
        md: "16"
      }}
      gap="8">
      <Heading
        fontSize="5xl"
        mb="-6">
        hoooold up!
      </Heading>
      <Text
        fontSize="l">
        please login to continue.
      </Text>
      <Tabs
        size="lg"
        isFitted
        variant='line'
        defaultIndex={1}>
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
            <LoginForm redirect={redirect || undefined} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </OwlPage>
  )
}

export default AuthWall
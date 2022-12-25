import { Flex, Heading, HStack, Text, Image, Button, VStack, Link } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { IoMdBrowsers, IoMdPerson } from 'react-icons/io'
import { useAuth } from '../../features/auth/AuthContext'
import useAuthWall from '../../features/auth/useAuthWall'
import Page from "../../features/layout/Page.layout"

const Dashboard: React.FC = () => {

  useAuthWall()

  const { user } = useAuth();
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
        flexGrow="1"
        flexDirection={{
          base: "column",
          md: "row"
        }}>

        {/* Control Panel */}
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
      </Flex>
    </Page>
  )
}

export default Dashboard